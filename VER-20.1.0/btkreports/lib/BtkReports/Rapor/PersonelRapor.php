<?php
/**
 * BTK Raporlama Modülü - Personel Rapor Sınıfı
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, AbstractBtkRapor'dan türer ve BTK'nın talep ettiği aylık
 * Personel raporlarının oluşturulması için gerekli olan spesifik
 * veri çekme ve özel formatlama mantığını içerir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

use BtkReports\Manager\PersonelManager;

class PersonelRapor extends AbstractBtkRapor
{
    /**
     * Personel raporu için gereken veriyi veritabanından çeker.
     */
    protected function getRaporVerisi(): array
    {
        return PersonelManager::getReportablePersonel();
    }

    /**
     * Personel raporunun içeriğini, BTK'nın istediği özel "|" (pipe) ayraçlı formatta oluşturur.
     */
    protected function generateFileContent(): string
    {
        $raporVerisi = $this->getRaporVerisi();
        if (empty($raporVerisi)) {
            return '';
        }

        $contentLines = [];
        foreach ($raporVerisi as $personel) {
            // BTK'nın dökümanında belirttiği KESİN sıralama ve format
            $line = [
                $personel['firma_unvani'],
                $personel['ad'],
                $personel['soyad'],
                $personel['tckn'],
                $personel['dogum_tarihi'] ? date('d.m.Y', strtotime($personel['dogum_tarihi'])) : '',
                $personel['unvan'],
                $personel['departman_adi'],
                $personel['mobil_tel'],
                $personel['sabit_tel'],
                $personel['eposta'],
                $personel['acik_adres'],
                $personel['acil_durum_kisi_adi'],
                $personel['acil_durum_kisi_gsm'],
                $personel['ise_baslama_tarihi'] ? date('d.m.Y', strtotime($personel['ise_baslama_tarihi'])) : '',
                $personel['isten_ayrilma_tarihi'] ? date('d.m.Y', strtotime($personel['isten_ayrilma_tarihi'])) : '',
                $personel['is_birakma_nedeni'],
            ];
            
            // Tüm alanları temizle (boşluk, | karakteri vb.) ve birleştir
            $cleanLine = array_map(function ($value) {
                return mb_strtoupper(str_replace(['|', "\r", "\n"], ' ', (string)$value), 'UTF-8');
            }, $line);
            
            $contentLines[] = implode('|', $cleanLine);
        }

        return implode("\n", $contentLines);
    }
}