<?php

declare(strict_types=1);

use Slim\Factory\ServerRequestCreatorFactory;

/** @var Slim\App $app */
$app = require dirname(__DIR__) . '/bootstrap/app.php';

$request = ServerRequestCreatorFactory::create()->createServerRequestFromGlobals();

$app->run($request);
