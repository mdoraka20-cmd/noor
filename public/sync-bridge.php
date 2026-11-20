<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$ALLOWED_KEYS = array(
    'inv_billing_fresh_v1_shop' => true,
    'inv_billing_fresh_v1_products' => true,
    'inv_billing_fresh_v1_customers' => true,
    'inv_billing_fresh_v1_invoices' => true,
    'inv_billing_fresh_v1_payments' => true,
    'inv_billing_fresh_v1_txns' => true,
    'inv_billing_fresh_v1_users' => true,
    'inv_billing_fresh_v1_dealers' => true,
    'inv_billing_fresh_v1_payment_methods' => true,
    'inv_billing_fresh_v1_categories' => true,
    'inv_billing_fresh_v1_vendors' => true,
    'inv_billing_fresh_v1_staff_perms' => true,
    'inv_billing_fresh_v1_notice' => true,
    'inv_billing_fresh_v1_contacts' => true,
    'inv_billing_fresh_v1_sms_logs' => true,
    'inv_billing_fresh_v1_sms_settings' => true,
    'inv_billing_fresh_v1_stock_ins' => true,
    'inv_billing_fresh_v1_delivery_challans' => true,
);

$storeFile = rtrim(sys_get_temp_dir(), '/\\') . '/ntiles_live_sync_' . md5(__DIR__) . '.json';

function sortAssocRecursive($val) {
    if (!is_array($val)) {
        return $val;
    }
    $isAssoc = false;
    $idx = 0;
    foreach ($val as $k => $v) {
        if ($k !== $idx) {
            $isAssoc = true;
            break;
        }
        $idx++;
    }
    if ($isAssoc) {
        ksort($val);
        foreach ($val as $k => $v) {
            $val[$k] = sortAssocRecursive($v);
        }
        return $val;
    }
    foreach ($val as $i => $v) {
        $val[$i] = sortAssocRecursive($v);
    }
    return $val;
}

function stableJson($val): string {
    return json_encode(sortAssocRecursive($val), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: 'null';
}

function loadStoreFromHandle($fp): array {
    rewind($fp);
    $raw = stream_get_contents($fp);
    if ($raw === false || trim($raw) === '') {
        return array('version' => 0, 'keys' => array());
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || !isset($decoded['version']) || !isset($decoded['keys']) || !is_array($decoded['keys'])) {
        return array('version' => 0, 'keys' => array());
    }
    return array(
        'version' => (int)$decoded['version'],
        'keys' => $decoded['keys'],
    );
}

$action = isset($_GET['action']) ? (string)$_GET['action'] : 'state';
$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$fp = @fopen($storeFile, 'c+');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'Cannot open sync store file'));
    exit;
}

if ($action === 'push' && $method === 'POST') {
    $rawBody = file_get_contents('php://input', false, null, 0, 8 * 1024 * 1024 + 1);
    if ($rawBody === false || strlen($rawBody) > 8 * 1024 * 1024) {
        fclose($fp);
        http_response_code(413);
        echo json_encode(array('ok' => false, 'error' => 'Payload too large'));
        exit;
    }
    $payload = json_decode($rawBody, true);
    if (!is_array($payload) || !isset($payload['changes']) || !is_array($payload['changes'])) {
        fclose($fp);
        http_response_code(400);
        echo json_encode(array('ok' => false, 'error' => 'Invalid JSON payload'));
        exit;
    }

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        http_response_code(503);
        echo json_encode(array('ok' => false, 'error' => 'Sync lock unavailable'));
        exit;
    }

    $store = loadStoreFromHandle($fp);
    $nowIso = gmdate('c');
    $changedCount = 0;

    foreach ($payload['changes'] as $key => $nextVal) {
        if (!isset($ALLOWED_KEYS[$key])) {
            continue;
        }
        $existingRec = isset($store['keys'][$key]) && is_array($store['keys'][$key]) ? $store['keys'][$key] : null;
        if ($existingRec !== null && array_key_exists('value', $existingRec)) {
            if (stableJson($existingRec['value']) === stableJson($nextVal)) {
                continue;
            }
        }
        $store['version'] += 1;
        $store['keys'][$key] = array(
            'version' => $store['version'],
            'updatedAt' => $nowIso,
            'value' => $nextVal,
        );
        $changedCount += 1;
    }

    if ($changedCount > 0) {
        $encoded = json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($encoded !== false) {
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, $encoded);
            fflush($fp);
        }
    }

    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(array(
        'ok' => true,
        'version' => $store['version'],
        'changedCount' => $changedCount,
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (!flock($fp, LOCK_SH)) {
    fclose($fp);
    http_response_code(503);
    echo json_encode(array('ok' => false, 'error' => 'Sync read lock unavailable'));
    exit;
}

$store = loadStoreFromHandle($fp);
flock($fp, LOCK_UN);
fclose($fp);

$since = isset($_GET['since']) && is_numeric($_GET['since']) ? (int)$_GET['since'] : 0;
$serverVersion = (int)$store['version'];

if ($action === 'poll' && $since > 0 && $since === $serverVersion) {
    echo json_encode(array(
        'ok' => true,
        'changed' => false,
        'version' => $serverVersion,
    ));
    exit;
}

$isIncremental = $since > 0 && $since <= $serverVersion;
$outKeys = new stdClass();
$keysArr = array();

foreach ($store['keys'] as $k => $rec) {
    if (!isset($ALLOWED_KEYS[$k]) || !is_array($rec) || !array_key_exists('value', $rec)) {
        continue;
    }
    $recVer = isset($rec['version']) ? (int)$rec['version'] : $serverVersion;
    if ($isIncremental && $recVer <= $since) {
        continue;
    }
    $keysArr[$k] = $rec['value'];
}

echo json_encode(array(
    'ok' => true,
    'changed' => true,
    'version' => $serverVersion,
    'full' => !$isIncremental,
    'keys' => empty($keysArr) ? $outKeys : $keysArr,
), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
