-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 03 Tem 2017, 16:18:16
-- Sunucu sürümü: 5.6.35
-- PHP Sürümü: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `alialkan_cswhm`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mod_eFatura_branches`
--

CREATE TABLE `mod_eFatura_branches` (
  `id` int(11) UNSIGNED NOT NULL,
  `country` varchar(255) NOT NULL,
  `branch_id` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mod_eFatura_branches`
--
ALTER TABLE `mod_eFatura_branches`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_branches`
--
ALTER TABLE `mod_eFatura_branches`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




CREATE TABLE `mod_eFatura_clients` (
  `id` int(11) UNSIGNED NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `remote_client_id` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `mod_eFatura_clients`
--


--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mod_eFatura_clients`
--
ALTER TABLE `mod_eFatura_clients`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_clients`
--
ALTER TABLE `mod_eFatura_clients`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--

CREATE TABLE `mod_eFatura_config` (
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `mod_eFatura_config`
--

INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
('auto_invoicing_enabled', '0'),
('branch', '100054'),
('ClaimedRole', '0'),
('clients_visibility_enabled', '1'),
('CopyIndicator', '0'),
('creation_filter', 'a:3:{s:7:\"created\";a:2:{s:7:\"gateway\";s:1:\"0\";s:14:\"withoutgateway\";s:1:\"0\";}s:4:\"paid\";a:3:{s:11:\"withtransid\";s:1:\"0\";s:11:\"withinvoice\";s:1:\"1\";s:7:\"gateway\";s:1:\"0\";}s:8:\"refunded\";a:1:{s:8:\"document\";s:1:\"1\";}}'),
('creation_type', 'instant'),
('CustomizationID', '0'),
('DigestValue', '/tU1AUtDfpRCah2varQqaOzCkh0av3XDbJcVp56QKkk='),
('emailtemplates', '481,482,483,484,485'),
('etiket', 'defaultpk@izmar.com.tr'),
('exponent', 'AQAB'),
('gonderici', 'defaultgb@izmar.com.tr'),
('identity_fieldid', '7'),
('identity_fieldname', '8'),
('invoice_calculate_tax', '0'),
('invoice_client_name', '2'),
('invoice_client_name_fieldid', '0'),
('invoice_comments', ''),
('invoice_company', 'İZMAR BİLİŞİM HİZMETLERİ SANAYİ TİCARET LİMİTED ŞİRKETİ'),
('invoice_company_badi', ''),
('invoice_company_bn', '67'),
('invoice_company_email', 'info@izmar.com.tr'),
('invoice_company_fax', '902323320554'),
('invoice_company_ilce', 'Konak'),
('invoice_company_kn', '4'),
('invoice_company_mahalle', 'Alsancak'),
('invoice_company_mn', '0484072813400012'),
('invoice_company_pk', '35220'),
('invoice_company_sehir', 'İZMİR'),
('invoice_company_sokak', 'Şair Eşref Bulvarı'),
('invoice_company_tel', '902323320554'),
('invoice_company_tipi', 'TUZEL'),
('invoice_company_tn', '137646'),
('invoice_company_vd', 'KORDON'),
('invoice_company_vn', '4840728134'),
('invoice_company_web', 'http://kablosuzonline.com/'),
('invoice_language', 'override'),
('invoice_remote_dates', '0'),
('invoice_start_n', '1000514'),
('invoice_subject', 'Invoice Items'),
('localkey', '=03OiMTM2AjNxAjMioDO6M3OiUGdhR2ajVGajJiO5ozc7ISMiJGM5YmNxcjNzIWMzE2YhdjZhVDNiZTN\n4EzNyEWN3IiOyMjOztjIoNXYoVDZtJiO3ozc7ISPulWYt9GZgELxfScYjFGbxSsbhxGb1tGIuFLxz5WY\nzlGTioDNzozc7IyckxWZpZWbvR3c1NmI6ITM6M3OiEmc1RXYGV2Lz52bkRWYvMXZsVHZv12L0N3bo9Cb\ntRHafNWasJWdw9icl5WYrxWYpxWYvUWbvh2LiojN1ozc7ISey9GdjVmcpRGZpxWY2JiO0EjOztjI0QjM\nugDNx4iM54yN3IiOzEjOztjIwlGZpxWY2JiO3ozc7ISbvNmLtVHdz9GarJXd05yd3dHLt92Yu0Wd0N3b\notmc1RnI6MzM6M3Oi4Wah12bkRWasFmdioTMxozc7ISeshGdu9WTiozN6M3OiUGbjl3Yn5WasxWaiJiO\nyEjOztjIzETL2ATL2EDMyIiOwEjOztjIlRXYkVWdkRHel5mI6ETM6M3OiMTMtYDMtYTMwIjI6ATM6M3O\niUGdhR2ZlJnI6cjOztjIhJXd0FmRlBCdz9GSrJHvDTlI6cTM6M3OiUWbh5GdjVHZvJHcioTMxozc7ICN\n0EjI6MjOztjIklGdjVHZvJHcioTO6M3OiMDOyIjI6QjOztjIklWZjlmdyV2cioTO6M3Oi02bj5CbpFWb\nnBUMpxWYyVmbhtGbhJiOxIjOztjIslWYtVmI6UjOztjIuALxU5Zxg4CRUxEIuMEsETFIeWcSEBSRWBiL\nOF0Ug4iWwSMSg0EsE7ZxwSMTwSsQgQVROJVRU5EsEDCVT9ESLJFnDTlI6gjN6M3OiUWbh5WeuFGct92Y\nioTMxozc7IiUF5UQLxUQg4WYrxWQiozMxozc7ISZtFmbkVmclR3cpdWZyJiO0EjOztjIlZXa0NWQiojN\n6M3OiMXd0FGdzJiO2ozc7pjNxoTYb5f72504de884f814da963497904bfa64122ba6acdee37f552c5\nbcc90f94e590'),
('modulus', '4VrReZ/0MI20tTAgDr8JKLqpxp1Wr6z2BaOuqAECWRMQOPNoaChzYs4GMaOAgzTQVmSQaKCynQHY\r\n8RGcWNUFwvJ6VTF0KIL56LGPrYpkRaRti6TVJ9WM4wopaX9HejEV99PgOyv6bMqFxkD29XrVJvFT\r\ndpj91A4zxn/mHRJppnHYTwE3ZU3E3JalnzO7EWKh/Ar/2JI/ABl5dBZwcM3Zs9oziEtqY/9PoLZG\r\nWRHWhtGQo7IUYME7zqGxQ+ApnMJDwBcCRwuxK+eWmrcqeBNUDVrgm2q42buT4davw1zBMFZpDXAq\r\nxbkHSRvaQ1OJKdIeFxGb/u1GuQ9aVqfFDZUELQ=='),
('override_language', 'turkish'),
('password', '82c74gLy'),
('payment_types', 'a:4:{s:9:\"ziraat3dn\";s:1:\"1\";s:12:\"banktransfer\";s:1:\"1\";s:6:\"paypal\";s:1:\"1\";s:11:\"garantibank\";s:1:\"1\";}'),
('payment_types_auto', 'a:4:{s:9:\"ziraat3dn\";s:1:\"0\";s:12:\"banktransfer\";s:1:\"0\";s:6:\"paypal\";s:1:\"0\";s:11:\"garantibank\";s:1:\"0\";}'),
('pdf_prefix', 'CBC'),
('ProfileID', '0'),
('system_demo', '1'),
('system_enabled', '1'),
('UBLVersionID', '0'),
('username', 'izmartestws'),
('version_check', '1474902220'),
('version_new', '1.0.17'),
('X509Certificate', 'MIIFjjCCBHagAwIBAgIIAKoE7aMBA5cwDQYJKoZIhvcNAQELBQAwXDELMAkGA1UEBhMCVFIxTTBL\r\nBgNVBAMMRE1hbGkgTcO8aMO8ciBFbGVrdHJvbmlrIFNlcnRpZmlrYSBIaXptZXQgU2HEn2xhecSx\r\nY8Sxc8SxIC0gU8O8csO8bSAxMB4XDTE1MDIwNTEzMDkwMFoXDTE4MDIwNDEzMDkwMFowNTETMBEG\r\nA1UEBRMKOTk5OTk5OTk5OTEeMBwGA1UEAwwVZS1GYXR1cmEgRGVuZW1lIEEuxZ4uMIIBIjANBgkq\r\nhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4VrReZ/0MI20tTAgDr8JKLqpxp1Wr6z2BaOuqAECWRMQ\r\nOPNoaChzYs4GMaOAgzTQVmSQaKCynQHY8RGcWNUFwvJ6VTF0KIL56LGPrYpkRaRti6TVJ9WM4wop\r\naX9HejEV99PgOyv6bMqFxkD29XrVJvFTdpj91A4zxn/mHRJppnHYTwE3ZU3E3JalnzO7EWKh/Ar/\r\n2JI/ABl5dBZwcM3Zs9oziEtqY/9PoLZGWRHWhtGQo7IUYME7zqGxQ+ApnMJDwBcCRwuxK+eWmrcq\r\neBNUDVrgm2q42buT4davw1zBMFZpDXAqxbkHSRvaQ1OJKdIeFxGb/u1GuQ9aVqfFDZUELQIDAQAB\r\no4ICeTCCAnUwHwYDVR0jBBgwFoAURiCpUxsoDByu8ihRg7MevvJTFHwwHQYDVR0OBBYEFD2IRAJL\r\nDZma7JstZJPUvFhicmlBMA4GA1UdDwEB/wQEAwIHgDCCATMGA1UdIASCASowggEmMIIBIgYLYIYY\r\nAQIBAQUHBAEwggERMCoGCCsGAQUFBwIBFh5odHRwOi8vZGVwby5rYW11c20uZ292LnRyL2lsa2Uw\r\ngeIGCCsGAQUFBwICMIHVHoHSAEIAdQAgAHMAZQByAHQAaQBmAGkAawBhACAAaQBsAGUAIABpAGwA\r\nZwBpAGwAaQAgAHMAZQByAHQAaQBmAGkAawBhACAAdQB5AGcAdQBsAGEAbQBhACAAZQBzAGEAcwBs\r\nAGEAcgExAG4BMQAgAG8AawB1AG0AYQBrACAAaQDnAGkAbgAgAGIAZQBsAGkAcgB0AGkAbABlAG4A\r\nIAB3AGUAYgAgAHMAaQB0AGUAcwBpAG4AaQAgAHoAaQB5AGEAcgBlAHQAIABlAGQAaQBuAGkAegAu\r\nMAwGA1UdEwEB/wQCMAAwFgYDVR0lBA8wDQYLYIYYAQIBAQUHMgEwQQYDVR0fBDowODA2oDSgMoYw\r\naHR0cDovL2RlcG8ua2FtdXNtLmdvdi50ci9rdXJ1bXNhbC9tbWVzaHMtczEuY3JsMIGCBggrBgEF\r\nBQcBAQR2MHQwPAYIKwYBBQUHMAKGMGh0dHA6Ly9kZXBvLmthbXVzbS5nb3YudHIva3VydW1zYWwv\r\nbW1lc2hzLXMxLmNydDA0BggrBgEFBQcwAYYoaHR0cDovL2Npc2R1cG1tczEua3VydW1zYWwua2Ft\r\ndXNtLmdvdi50cjANBgkqhkiG9w0BAQsFAAOCAQEAO55vHrnCf+WYMF9X6GoDn2ksNKywJiQzYhQS\r\ndYrQ35DQE1W9SE17RJ3ko5DXIbkyVaBaJ1Y4L0Oqe/klKtpKlEqi6zl3yLG81jdCKcK4ABTloMcO\r\nytl5ASwVlePa5rcR80aXeXvX9uPFaYx5bKNPgJNz6jizuR8NRx2kgRqThNQpPDsiBWAE/3PJL74X\r\nmxrNZ6nofQXDCWXWe+PHhIsH0PDJW2+jeBjNjyPXFhBQzBBmYpYEWqA4iyoG3q4+9rzOXqwQMqVO\r\nbJAqUi0bWYylshOO7bcThNBC+pRIoQapTkga7fo2rea1zNuaig9lGnbT/F5odiafpI9xqXY7MkcX\r\npA=='),
('X509IssuerName', 'CN=e-Fatura Deneme A.Ş.,2.5.4.5=#130a39393939393939393939'),
('X509SerialNumber', '47856164729324439'),
('X509SubjectName', 'CN=e-Fatura Deneme A.Ş.,2.5.4.5=#130a39393939393939393939');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mod_eFatura_config`
--
ALTER TABLE `mod_eFatura_config`
  ADD PRIMARY KEY (`name`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE `mod_eFatura_future_invoices` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoiceid` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `document_type` varchar(255) NOT NULL,
  `document_data` varchar(255) NOT NULL,
  `invoice_details` text NOT NULL,
  `creation_time` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `created` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `tip` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `mod_eFatura_future_invoices`
--

--
-- Tablo için indeksler `mod_eFatura_future_invoices`
--
ALTER TABLE `mod_eFatura_future_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_future_invoices`
--
ALTER TABLE `mod_eFatura_future_invoices`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



CREATE TABLE `mod_eFatura_history_clients` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `remote_client_id` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mod_eFatura_history_clients`
--
ALTER TABLE `mod_eFatura_history_clients`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_history_clients`
--
ALTER TABLE `mod_eFatura_history_clients`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



CREATE TABLE `mod_eFatura_history_invoices` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `invoice_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `document_id` varchar(255) NOT NULL DEFAULT '0',
  `document_unique_id` varchar(255) NOT NULL,
  `invoice_url` varchar(255) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `time` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mod_eFatura_history_invoices`
--
ALTER TABLE `mod_eFatura_history_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_history_invoices`
--
ALTER TABLE `mod_eFatura_history_invoices`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



CREATE TABLE `mod_eFatura_invoices` (
  `id` int(11) UNSIGNED NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `invoice_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `document_id` varchar(255) NOT NULL DEFAULT '0',
  `document_unique_id` varchar(255) NOT NULL,
  `invoice_url` varchar(300) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `time` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `mod_eFatura_invoices`
--

--
-- Tablo için indeksler `mod_eFatura_invoices`
--
ALTER TABLE `mod_eFatura_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mod_eFatura_invoices`
--
ALTER TABLE `mod_eFatura_invoices`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE `mod_eFatura_logs` (
  `id` int(11) UNSIGNED NOT NULL,
  `parent_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `message` text NOT NULL,
  `time` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
