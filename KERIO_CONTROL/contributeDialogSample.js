
kerio.waw.ui.contributeDialogSample = {

k_init: function(k_objectName){
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_tableData = [],
k_formCfg,
k_form,
k_dialog;
k_tableData.push( 
'PRODUCT VERSION, DB ID, SAMPLE LENGTH, SAMPLES \n' +
'7.3.0-A1/MB, 3f07587a-bb3a-4bd8–8f86-a7f5b2b83f34, 300, 4032'); 
k_tableData.push( 
'OS, ARCHITECTURE, FILE SYSTEM, CPU COUNT, MEMORY, CPU NAME\n' +
'Windows 7 x64, x86, NTFS, 8, 8465084416, Intel® Core™ i7–2600 CPU @ 3.40GHz'); 
k_tableData.push( 
'TABLE, ITEMS, SUBITEM SUM, SUBITEM MAX\n' +
'TRAFFIC, 3, 2, 1\n' +
'BM, 0, 0, 0\n' +
'HTTP, 7, 10, 6\n' +
'FTP, 5, 0, 0'); 
k_tableData.push( 
'TABLE, GROUPS, ITEMS\n' +
'IP, 2, 9\n' +
'URL, 4, 16\n' +
'TIME RANGES, 3, 7'); 
k_tableData.push( 
'CONNECTIVITY, INTERNET IFACES, DHCP AUTOMATIC, SCOPES, HOSTS ENABLED, HOSTS, DEF ROUTES 6, RA PREFIXES, RAS WEB DIALS\n' +
'Persistent, 2, 0, 0, 1, 1, 3, 0, 0'); 
k_tableData.push( 
'AD JOINED, PRIMARY DOMAIN, ADS DOMAINS, AOD DOMAINS, OTHER DOMAINS, AUTHENTICATION, USERS, AD AUTH USERS, AUTOIMPORT, STAR SIZE, ACTIVITY SIZE, RETENTION\n' +
'1, ADS, 1, 0, 0, 0, 0, 0, 0, 1167360, 66138, 24'); 
k_tableData.push( 
'NAME, ROTATION, SIZE, RULES, SYSLOGS\n' +
'alert, 0, 81666, 22, 1\n' +
'debug, 0, 7333779, 22, 0\n' +
'error, 0, 125512, 22, 0\n' +
'filter, 1, 133784, 22, 0\n' +
'warning, 0, 23906, 22, 0'); 
k_tableData.push( 
'MAX_VPNS, MAX_LEASES, MAX_RESERVATIONS\n' +
'0, 3, 2'); 
k_tableData.push( 
'NAME, CONNECTIONS\n' +
'HTTP, 185\n' +
'IRC, 1'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'1, 5\n' +
'5, 5\n' +
'10, 0\n' +
'20, 0\n' +
'50, 0\n' +
'100, 0\n' +
'150, 0'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'1, 4\n' +
'10, 1\n' +
'100, 0\n' +
'500, 0\n' +
'1000, 0\n' +
'2000, 0\n' +
'5000, 0'); 		
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'1, 5\n' +
'10, 0\n' +
'100, 0\n' +
'500, 0\n' +
'1000, 0\n' +
'2000, 0\n' +
'5000, 0'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'0, 5\n' +
'5, 0\n' +
'10, 0\n' +
'20, 0\n' +
'50, 0\n' +
'100, 0'); 			
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'0, 5\n' +
'5, 0\n' +
'10, 0\n' +
'20, 0\n' +
'50, 0\n' +
'100, 0\n' +
'150, 0'); 			
k_tableData.push( 
'ID, MAX_RX, MAX_TX\n' +
'9fcc7e59–9f28–4132–8f81-c23b2dab1fd6, 12852, 3556\n' +
'd9f5ff7c-2312–4014–97e3-eaa220b19754, 420944, 17831'); 
k_tableData.push( 
'USER_ID, CLIENT, APPLICATION, OS, EVENT_COUNT\n' +
'1, WebAdmin, MSIE 9.0, Windows 7, 13\n' +
'2, WebAdmin, MSIE 9.0, Windows 7, 1'); 
k_tableData.push( 
'WIDTH, HEIGHT, AMOUNT\n' +
'800, 600, 13\n' +
'1024, 768, 1'); 
k_tableData.push( 
'LOCALIZATION, AMOUNT\n' +
'en, 13\n' +
'ru, 1'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'0, 0\n' +
'301, 0\n' +
'901, 10\n' +
'1801, 0\n' +
'3601, 0\n' +
'7201, 0\n' +
'36001, 0'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'0, 0\n' +
'5001, 4\n' +
'10001, 2\n' +
'15001, 8\n' +
'20001, 0\n' +
'25001, 0\n' +
'30001, 0\n' +
'45001, 0\n' +
'60001, 0'); 
k_tableData.push( 
'INTERVAL_BEGIN, SAMPLES\n' +
'0, 0\n' +
'3001, 4\n' +
'5001, 2\n' +
'10001, 0\n' +			
'15001, 8\n' +
'30001, 0'); 
k_tableData.push( 
'lspci\n' +
'00:00.0 Host bridge: Intel Corporation 440BX/ZX/DX – 82443BX/ZX/DX Host bridge (rev 01)\n' +
'00:01.0 PCI bridge: Intel Corporation 440BX/ZX/DX – 82443BX/ZX/DX AGP bridge (rev 01)\n' +
'00:07.0 ISA bridge: Intel Corporation 82371AB/EB/MB PIIX4 ISA (rev 08)\n' +
'00:07.1 IDE interface: Intel Corporation 82371AB/EB/MB PIIX4 IDE (rev 01)\n' +
'00:07.3 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 08)\n' +
'00:0f.0 VGA compatible controller: VMware Inc Abstract SVGA II Adapter\n' +
'00:10.0 SCSI storage controller: LSI Logic / Symbios Logic 53c1030 PCI-X Fusion-MPT Dual Ultra320 SCSI (rev 01)\n' +
'00:11.0 Ethernet controller: Advanced Micro Devices [AMD] 79c970 [PCnet32 LANCE] (rev 10)\n' +
'00:12.0 Ethernet controller: Advanced Micro Devices [AMD] 79c970 [PCnet32 LANCE] (rev 10)'); 
k_tableData.push(
'lsmod\n' +
'Module Size Used by\n' +
'nfnetlink_queue 12801 1\n' +
'nfnetlink 12751 2 nfnetlink_queue\n' +
'kvnet 26369 2\n' +
'vmxnet 21887 0\n' +
'vmblock 13490 0\n' +
'vmsync 12603 0\n' +
'vmhgfs 46776 0\n' +
'vmci 52850 1 vmhgfs\n' +
'thermal 13058 0\n' +
'power_meter 13080 0\n' +
'fan 12594 0\n' +
'hed 12547 0\n' +
'pci_slot 12538 0\n' +
'sbs 12723 0\n' +
'sbshc 12668 1 sbs\n' +
'battery 12926 0\n' +
'video 17360 0\n' +
'kipf 143614 4\n' +
'vfat 17001 0\n' +
'fat 44112 1 vfat\n' +
'nls_base 12649 2 vfat,fat\n' +
'container 12525 0\n' +
'ac 12552 0\n' +
'button 12866 0\n' +
'power_supply 13283 3 sbs,battery,ac\n' +
'processor 26951 0\n' +
'thermal_sys 17669 4 thermal,fan,video,processor\n' +
'psmouse 45768 0\n' +
'evdev 12880 2\n' +
'serio_raw 12760 0\n' +
'pcspkr 12515 0\n' +
'ext3 102027 3\n' +
'jbd 40754 1 ext3\n' +
'mbcache 12810 1 ext3\n' +
'ata_generic 12439 0\n' +
'sd_mod 34942 4\n' +
'crc_t10dif 12332 1 sd_mod\n' +
'ata_piix 21079 0\n' +
'libata 131761 2 ata_generic,ata_piix\n' +
'mptspi 17681 3\n' +
'mptscsih 22264 1 mptspi\n' +
'mptbase 51789 2 mptspi,mptscsih\n' +
'scsi_transport_spi 19038 1 mptspi\n' +
'scsi_mod 134357 5 sd_mod,libata,mptspi,mptscsih,scsi_transport_spi'); 
k_tableData.push(
'DATE, MAX_USED_ACCOUNTS, MAX_USED_DEVICES\n' +
'1309816200, 15, 24\n' +
'1309902600, 14, 23');
k_formCfg = {
k_items: [{
k_type: 'k_textArea',
k_isReadOnly: true,
k_isLabelHidden: true,
k_value: k_tableData.join('\n\n'),
k_maxLength: -1
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, {
k_title: k_tr('Sample Data', 'contributeDialogSample'),
k_height: 450,
k_width: 400,
k_hasHelpIcon: false,
k_buttons: [{
k_caption: k_tr('Close', 'common'),
k_isCancel: true
}],
k_content: k_form
});
return k_dialog;
}
};