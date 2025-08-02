<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:documentation:2" xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001" xmlns:clm5639="urn:un:unece:uncefact:codelist:specification:5639:1988" xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001" xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2" xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2" xmlns:xbrldi="http://xbrl.org/2006/xbrldi" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:xdt="http://www.w3.org/2005/xpath-datatypes" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="cac cbc ccts clm54217 clm5639 clm66411 clmIANAMIMEMediaType fn link n1 qdt udt xbrldi xbrli xdt xlink xs xsd xsi">
	<xsl:decimal-format name="european" decimal-separator="," grouping-separator="." NaN=""/>
	<xsl:output version="4.0" method="html" indent="no" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
	<xsl:param name="SV_OutputFormat" select="'HTML'"/>
	<xsl:variable name="XML" select="/"/>
	<xsl:key name="unitcode" match="cbc:InvoicedQuantity" use="@unitCode"/>
	<xsl:template match="/">
		<html>
			<head>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
				<title/>
				<style type="text/css">body{
					    background-color:#FFFFFF;
					    font-family:'Tahoma', "Times New Roman", Times, serif;
					    font-size:11px;
					    color:#666666;
					    width:700px
					}
					
					h1,
					h2{
					    padding-bottom:3px;
					    padding-top:3px;
					    margin-bottom:5px;
					    text-transform:uppercase;
					    font-family:Arial, Helvetica, sans-serif;
					}
					
					h1{
					    font-size:1.4em;
					    text-transform:none;
					}
					
					h2{
					    font-size:1em;
					    color:brown;
					}
					
					h3{
					    font-size:1em;
					    color:#333333;
					    text-align:justify;
					    margin:0;
					    padding:0;
					}
					
					h4{
					    font-size:1.1em;
					    font-style:bold;
					    font-family:Arial, Helvetica, sans-serif;
					    color:#000000;
					    margin:0;
					    padding:0;
					}
					
					hr{
					    height:2px;
					    color:#000000;
					    background-color:#000000;
					    border-bottom:1px solid #000000;
					}
					
					p,
					ul,
					ol{
					    margin-top:1.5em;
					}
					
					ul,
					ol{
					    margin-left:3em;
					}
					
					blockquote{
					    margin-left:3em;
					    margin-right:3em;
					    font-style:italic;
					}
					
					a{
					    text-decoration:none;
					    color:#70A300;
					}
					
					a:hover{
					    border:none;
					    color:#70A300;
					}
					
					#despatchTable{
					    border-collapse:collapse;
					    font-size:11px;
					    float:right;
					    border-color:gray;
					
					}
					
					#ettnTable{
					    border-collapse:collapse;
					    font-size:11px;
					    border-color:gray;
					}
					
					#customerPartyTable{
					    border-width:0px;
					    border-spacing:;
					    border-style:inset;
					    border-color:gray;
					    border-collapse:collapse;
					    background-color:
					    }
					
					#customerIDTable{
					    border-width:2px;
					    border-spacing:;
					    border-style:inset;
					    border-color:gray;
					    border-collapse:collapse;
					    background-color:
					    }
					
					#customerIDTableTd{
					    border-width:2px;
					    border-spacing:;
					    border-style:inset;
					    border-color:gray;
					    border-collapse:collapse;
					    background-color:
					    }
					
					#lineTable{
					    border-width:1px;
					<!-- border-spacing:;-->
					    border-style:inset;
					    border-color:gray;
					    border-collapse:collapse;
					<!--background-color:;-->
					}
					
					#lineTableTd{
					    border-width:1px;
					    padding:3px;
					    border-style:inset;
					    border-color:gray;
					    background-color:white;
					}
					
					#lineTableTr{
					    border-width:1px;
					    padding:0px;
					    border-style:inset;
					    border-color:white;
					    background-color:white;
					    -moz-border-radius:;
					}
					
					#lineTableDummyTd{
					    border-width:1px;
					    border-color:white;
					    padding:1px;
					    border-style:inset;
					    border-color:white;
					    background-color:white;
					}
					
					#lineTableBudgetTd{
					    border-width:1px;
					    border-spacing:0px;
					    padding:5px;
					    border-style:inset;
					    border-color:gray;
					    background-color:white;
					    -moz-border-radius:;
					}
					
					#notesTable{
					
					    border-width:2px;
					    border-spacing:;
					    border-style:inset;
					    border-color:white;
					    border-collapse:collapse;
					    background-color:
					    border:0px;
					    vertical-align:middle;
					    border-top:1px solid darkgray;
					    }
					
					#notesTableTd{
					
					
					    border-width:0px;
					    border-spacing:;
					    border-style:inset;
					    border-color:white;
					    border-collapse:collapse;
					    background-color:
					    }
					
					table{
					
					    border-spacing:2px;
					
					}
					
					#budgetContainerTable{
					
					    border-width:0px;
					    border-spacing:0px;
					    border-style:inset;
					    border-color:white;
					    border-collapse:collapse;
					<!-- background-color:;-->
					    margin-top:5px
					
					}
					
					td{
					    border-color:gray;
					}
					#bankingTable{
			border-collapse:collapse;
			border-width: 0px;
			border-style: inset;
			font-size:11px;
			float:left;
			border-color:gray;
			}
			#bankingTable th{
			float:leftt;
			border-color:gray;
			background-color:#00AF33;
			color: white;
			}
					</style>
				<title>e-Arşiv Fatura</title>
			</head>
			<body style="margin-left=0.6in; margin-right=0.6in;  margin-bottom=0.79in;border-top: 2px solid #00AF33;height:auto; width:793px; margin-top:10px">
				<xsl:for-each select="$XML">
					<table cellspacing="0px" width="793" cellpadding="-20px" style="border-bottom:2px solid #00AF33; padding-top:10px;padding-bottom:10px">
						<tbody>
							<tr valign="top" style="width:450px">
															<td style="vertical-align:top;">
									<img alt="Firma Logo" style="margin-top: 5px; margin-left: 0px; margin-right: 0px;margin-bottom: -30px" src=" data:image/png;base64,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"/>
								</td>

								<td>
									<table>
										<tbody>
											<tr>
												<td colspan="4" style="color:black;font-weight:bold;font-size:16px; padding-left:4px">
													<xsl:for-each select="//cac:AccountingSupplierParty/cac:Party/cac:PartyName">
														<xsl:value-of select="cbc:Name"/>
													</xsl:for-each>
												</td>
											</tr>
											<tr>
												<td>
													<table>
														<tbody>
															<tr>
																<td style="vertical-align:top;width:55px">
																	<b>ADRES</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top; " colspan="3">
																	<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PostalAddress">
																		<xsl:if test="cbc:Region !=''">
																			<xsl:value-of select="cbc:Region"/>
																			<span>
																				<xsl:text>&#xA0;</xsl:text>
																			</span>
																		</xsl:if>
																		<xsl:for-each select="cbc:StreetName">
																			<xsl:choose>
																				<xsl:when test="contains(., 'Mersis No:')">
																					<xsl:value-of select="normalize-space(substring-before(., 'Mersis No:'))"/>
																				</xsl:when>
																				<xsl:otherwise>
																					<xsl:value-of select="."/>
																				</xsl:otherwise>
																			</xsl:choose>
																			<span>
																				<xsl:text>&#xA0;</xsl:text>
																			</span>
																		</xsl:for-each>
																		<xsl:for-each select="cbc:BuildingName">
																			<xsl:apply-templates/>
																		</xsl:for-each>
																		<xsl:for-each select="cbc:BuildingNumber">
																			<xsl:if test=". !=''">
																				<span>
																					<xsl:text> No : </xsl:text>
																				</span>
																				<xsl:value-of select="."/>
																			</xsl:if>
																			<span>
																				<xsl:text> </xsl:text>
																			</span>
																		</xsl:for-each>
																		<xsl:for-each select="cbc:Room">
																			<xsl:if test=". !=''">
																				<span>
																					<xsl:text>/</xsl:text>
																				</span>
																				<xsl:value-of select="."/>
																			</xsl:if>
																			<span>
																				<xsl:text> </xsl:text>
																			</span>
																		</xsl:for-each>
																		<xsl:for-each select="cbc:PostalZone">
																			<xsl:apply-templates/>
																			<span>
																				<xsl:text> </xsl:text>
																			</span>
																		</xsl:for-each>
																		<xsl:for-each select="cbc:CitySubdivisionName">
																			<xsl:apply-templates/>
																		</xsl:for-each>
																		<span>
																			<xsl:text>&#xA0;/&#xA0;</xsl:text>
																		</span>
																		<xsl:for-each select="cbc:CityName">
																			<xsl:apply-templates/>
																			<span>
																				<xsl:text>&#xA0;</xsl:text>
																			</span>
																		</xsl:for-each>
																	</xsl:for-each>
																	<!--<xsl:text>-&#xA0;Sermayesi :3.100.000,00 TL</xsl:text>-->
																</td>
															</tr>
															<tr>
																<td style="vertical-align:top">
																	<b>TEL</b>
																	<span style="float:right;font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top; width:92px">
																	<xsl:for-each select="//cac:AccountingSupplierParty/cac:Party/cac:Contact">
																		<xsl:if test="cbc:Telephone">
																			<xsl:for-each select="cbc:Telephone">
																				<xsl:apply-templates/>
																			</xsl:for-each>
																		</xsl:if>
																	</xsl:for-each>
																</td>
																<td style="vertical-align:top; width:95px">
																	<b>E-MAIL</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:ElectronicMail">
																		<xsl:value-of select="."/>
																	</xsl:for-each>
																</td>
															</tr>
															<tr>
																<td style="vertical-align:top">
																	<b>FAX</b>
																	<span style="float:right;font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//cac:AccountingSupplierParty/cac:Party/cac:Contact">
																		<xsl:if test="cbc:Telefax">
																			<xsl:for-each select="cbc:Telefax">
																				<xsl:apply-templates/>
																			</xsl:for-each>
																		</xsl:if>
																	</xsl:for-each>
																</td>
																<td style="vertical-align:top">
																	<b>Tic. Sicil No</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
																		<xsl:if test="cbc:ID !='' and cbc:ID/@schemeID='TICARETSICILNO'">
																			<xsl:value-of select="cbc:ID"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>
															</tr>
															<tr>
																<td style="vertical-align:top">
																	<b>V.D.</b>
																	<span style="float:right;font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme">
																		<xsl:for-each select="cbc:Name">
																			<xsl:apply-templates/>
																		</xsl:for-each>
																	</xsl:for-each>
																</td>
																	<td style="vertical-align:top">
																	<b>WEB</b>
																	<span style="float:right;font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cbc:WebsiteURI">
																		<xsl:value-of select="."/>
																	</xsl:for-each>
																</td>
																	<!--<td style="vertical-align:top">
																	<b>Mersis No</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
																		<xsl:if test="cbc:ID !='' and cbc:ID/@schemeID='Mersis'">
																			<xsl:value-of select="cbc:ID"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>-->
																<!--<td style="vertical-align:top">
																	<b>MersisNo</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:StreetName">
																		<xsl:if test="contains(., 'Mersis No:')">
																			<xsl:value-of select="normalize-space(substring-after(.,'Mersis No:'))"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>-->
															</tr>
															<tr>
																<td style="vertical-align:top">
																	<b>VKN</b>
																	<span style="float:right;font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
															<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
																		<xsl:if test="cbc:ID !='' and cbc:ID/@schemeID='VKN'">
																			<xsl:value-of select="cbc:ID"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>
															
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
								<!--<td style="vertical-align:middle">
									<img alt="" width="100px" src="data:image/png;base64,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"/>
								</td>-->
							</tr>
						</tbody>
					</table>
					<table cellspacing="0px" width="763" cellpadding="0px">
						<tbody>
							<tr style="height:118px; " valign="top">
								<td width="40%" valign="top" style="padding-top:10px">
									<table id="customerPartyTable" align="left" border="0" height="50%" style="margin-bottom: 5px;border: 1px solid #00AF33; border-left-width:5px; width:95%; margin-left:-2px">
										<tbody>
											<tr style="height:71px; ">
												<td style="padding:0px">
													<table align="center" border="0" style="padding:5px 10px">
														<tbody>
															<tr>
																<xsl:for-each select="n1:Invoice">
																	<xsl:for-each select="cac:AccountingCustomerParty">
																		<xsl:for-each select="cac:Party">
																			<td style="width:469px; padding-bottom:2px; padding-left:2px " align="left">
																				<span style="font-weight:bold; ">
																					<xsl:text>SAYIN</xsl:text>
																				</span>
																			</td>
																		</xsl:for-each>
																	</xsl:for-each>
																</xsl:for-each>
															</tr>
															<tr>
																<xsl:for-each select="n1:Invoice">
																	<xsl:for-each select="cac:AccountingCustomerParty">
																		<xsl:for-each select="cac:Party">
																			<td style="width:469px; padding:1px 0px; padding-left:2px" align="left">
																				<xsl:if test="cac:PartyName">
																					<xsl:value-of select="cac:PartyName/cbc:Name"/>
																				</xsl:if>
																				<xsl:for-each select="cac:Person">
																					<xsl:for-each select="cbc:Title">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:FirstName">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:MiddleName">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0; </xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:FamilyName">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:NameSuffix">
																						<xsl:apply-templates/>
																					</xsl:for-each>
																				</xsl:for-each>
																			</td>
																		</xsl:for-each>
																	</xsl:for-each>
																</xsl:for-each>
															</tr>
															<tr>
																<xsl:for-each select="n1:Invoice">
																	<xsl:for-each select="cac:AccountingCustomerParty">
																		<xsl:for-each select="cac:Party">
																			<td style="width:469px; padding:1px 0px; padding-left:2px" align="left">
																				<xsl:for-each select="cac:PostalAddress">
																					<xsl:if test="cbc:Region !=''">
																						<xsl:value-of select="cbc:Region"/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:if>
																					<xsl:for-each select="cbc:StreetName">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:BuildingName">
																						<xsl:apply-templates/>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:BuildingNumber">
																						<xsl:if test=". !=''">
																							<span>
																								<xsl:text> No : </xsl:text>
																							</span>
																							<xsl:value-of select="."/>
																						</xsl:if>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:Room">
																						<xsl:if test=". !=''">
																							<span>
																								<xsl:text>/</xsl:text>
																							</span>
																							<xsl:value-of select="."/>
																							<span>
																								<xsl:text>&#xA0;</xsl:text>
																							</span>
																						</xsl:if>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:PostalZone">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																					<xsl:for-each select="cbc:CitySubdivisionName">
																						<xsl:apply-templates/>
																					</xsl:for-each>
																					<span>
																						<xsl:text> / </xsl:text>
																					</span>
																					<xsl:for-each select="cbc:CityName">
																						<xsl:apply-templates/>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</xsl:for-each>
																				</xsl:for-each>
																			</td>
																		</xsl:for-each>
																	</xsl:for-each>
																</xsl:for-each>
															</tr>
															<xsl:if test="n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:Contact/cbc:ElectronicMail !=''">
																<xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:Contact/cbc:ElectronicMail">
																	<tr align="left" style="width:469px; padding:1px 0px; padding-left:2px">
																		<td>
																			<b>
																				<xsl:text>E-Posta : </xsl:text>
																			</b>
																			<xsl:value-of select="."/>
																		</td>
																	</tr>
																</xsl:for-each>
															</xsl:if>
															<xsl:for-each select="n1:Invoice">
																<xsl:for-each select="cac:AccountingCustomerParty">
																	<xsl:for-each select="cac:Party">
																		<xsl:for-each select="cac:Contact">
																			<xsl:if test="cbc:Telephone !='' or cbc:Telefax !=''">
																				<tr align="left">
																					<td style="width:469px; padding:1px 0px; padding-left:2px;" align="left">
																						<xsl:if test="cbc:Telephone !=''">
																							<xsl:for-each select="cbc:Telephone">
																								<span>
																									<b>
																										<xsl:text>Tel : </xsl:text>
																									</b>
																								</span>
																								<xsl:apply-templates/>
																							</xsl:for-each>
																						</xsl:if>
																						<xsl:if test="cbc:Telephone !='' and cbc:Telefax !=''">
																							<b>
																								<xsl:text> - </xsl:text>
																							</b>
																						</xsl:if>
																						<xsl:if test="cbc:Telefax !=''">
																							<xsl:for-each select="cbc:Telefax">
																								<span>
																									<b>
																										<xsl:text>Fax : </xsl:text>
																									</b>
																								</span>
																								<xsl:apply-templates/>
																							</xsl:for-each>
																						</xsl:if>
																						<span>
																							<xsl:text>&#xA0;</xsl:text>
																						</span>
																					</td>
																				</tr>
																			</xsl:if>
																			<tr align="left">
																				<td style="padding:1px 0px; padding-left:2px">
																					<xsl:if test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name">
																						<span>
																							<b>
																								<xsl:text>V.D. : </xsl:text>
																							</b>
																							<xsl:value-of select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name"/>
																							<xsl:text> - </xsl:text>
																						</span>
																					</xsl:if>
																					<xsl:if test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID !=''">
																						<xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification">
																							<xsl:if test="cbc:ID/@schemeID = 'VKN'">
																								<b>
																									<xsl:value-of select="cbc:ID/@schemeID"/>
																									<xsl:text> : </xsl:text>
																								</b>
																								<xsl:value-of select="cbc:ID"/>
																							</xsl:if>
																						</xsl:for-each>
																					</xsl:if>
																				</td>
																			</tr>
																		</xsl:for-each>
																	</xsl:for-each>
																</xsl:for-each>
															</xsl:for-each>
															<xsl:if test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID !=''">
																<xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification">
																	<xsl:if test="cbc:ID/@schemeID != 'VKN'">
																		<tr align="left">
																			<td style="width:469px; padding:1px 0px; padding-left:2px" align="left">
																				<b>
																					<xsl:value-of select="cbc:ID/@schemeID"/>
																					<xsl:text> : </xsl:text>
																				</b>
																				<xsl:value-of select="cbc:ID"/>
																			</td>
																		</tr>
																	</xsl:if>
																</xsl:for-each>
															</xsl:if>
															<xsl:if test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:AgentParty/cac:PartyIdentification/cbc:ID !=''">
																<xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:AgentParty/cac:PartyIdentification">
																	<tr align="left">
																		<td style="width:469px; padding:1px 0px; padding-left:2px" align="left">
																			<b>
																				<xsl:value-of select="cbc:ID/@schemeID"/>
																				<xsl:text> : </xsl:text>
																			</b>
																			<xsl:value-of select="cbc:ID"/>
																		</td>
																	</tr>
																</xsl:for-each>
															</xsl:if>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
								<td width="27%" align="center" valign="middle" >
									<img style="width:91px; margin-top:20px" align="middle" alt="E-Fatura Logo" src="data:image/jpeg;base64,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"/>
									<h1 align="center" style="padding:0px">
										<span style="font-weight:bold; ">
											<xsl:text>e-Arşiv Fatura</xsl:text>
										</span>
									</h1>
									<img alt="" width="100px" src=" data:image/jpeg;base64,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AEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBywAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQASwAAAABAAIBLAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADXQAAAAYAAAAAAAAAAAAAAKsAAAF/AAAAFAB5ATEAbABkATEAegAgAGkAbQB6AGEAIABzAGkAcgBrAPwAIAD2AG4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAX8AAACrAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9u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bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4NCgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iQzJCNzA2QzgwRDVDMEJBNjQ1NjIyN0M4Q0RGRjIxRjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzg5N0Q2NUFCNEFCRTUxMTk4NkRBOUYxQTg5QjE5NUYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iQzJCNzA2QzgwRDVDMEJBNjQ1NjIyN0M4Q0RGRjIxRjQiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wOkNyZWF0ZURhdGU9IjIwMTUtMTItMjZUMTE6MzQ6NTcrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE1LTEyLTI2VDExOjM4OjAxKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE1LTEyLTI2VDExOjM4OjAxKzAyOjAwIj4NCgkJCTx4bXBNTTpIaXN0b3J5Pg0KCQkJCTxyZGY6U2VxPg0KCQkJCQk8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Nzc5N0Q2NUFCNEFCRTUxMTk4NkRBOUYxQTg5QjE5NUYiIHN0RXZ0OndoZW49IjIwMTUtMTItMjZUMTE6Mzg6MDErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+DQoJCQkJCTxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODk3RDY1QUI0QUJFNTExOTg2REE5RjFBODlCMTk1RiIgc3RFdnQ6d2hlbj0iMjAxNS0xMi0yNlQxMTozODowMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4NCgkJCQk8L3JkZjpTZXE+DQoJCQk8L3htcE1NOkhpc3Rvcnk+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCTwvcmRmOlJERj4NCjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAzAHADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJico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"/>
								</td>
								<td width="33%" align="center" valign="top" colspan="2" style="padding-top:10px">
									<table border="0" height="13" id="despatchTable" style="border: 1px solid black; margin-right: -2px;">
										<tbody>
											<xsl:if test="n1:Invoice/cbc:CustomizationID !=''">
												<tr style="height:13px; ">
													<td style="width:105px; padding:4px;background-color: #00AF33; color: white; " align="left">
														<span style="font-weight:bold; ">
															<xsl:text>Özelleştirme No</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding:4px">
														<span>:</span>
													</td>
													<td style="padding: 4px; min-width: 112px;padding:4px;" align="left">
														<xsl:for-each select="n1:Invoice">
															<xsl:for-each select="cbc:CustomizationID">
																<xsl:apply-templates/>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<!--<xsl:if test="n1:Invoice/cbc:ProfileID !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #00AF33; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Senaryo</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px; ">
														<xsl:for-each select="n1:Invoice">
															<xsl:for-each select="cbc:ProfileID">
																<xsl:apply-templates/>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>-->
											<xsl:if test="n1:Invoice/cbc:InvoiceTypeCode !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #00AF33; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tipi</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:for-each select="n1:Invoice">
															<xsl:for-each select="cbc:InvoiceTypeCode">
																<xsl:apply-templates/>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="n1:Invoice/cbc:ID !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #00AF33;color:white ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura No</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px; ">
														<xsl:for-each select="n1:Invoice">
															<xsl:for-each select="cbc:ID">
																<xsl:apply-templates/>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="n1:Invoice/cbc:IssueDate !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #00AF33; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tarihi</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:for-each select="n1:Invoice">
															<xsl:for-each select="cbc:IssueDate">
																<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</tr>
											
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #00AF33; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Zamanı</xsl:text>
														</span>
													</td>
													<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:if test="n1:Invoice/cbc:IssueTime != ''"><xsl:value-of select="n1:Invoice/cbc:IssueTime"/></xsl:if>
										
													</td>
												</tr>
												<xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
													<xsl:if test="cbc:ID !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px;background-color: #00AF33; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye No :</xsl:text>
																</span>
															</td>
															<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
																<span>:</span>
															</td>
															<td align="left" style="padding: 4px">
																<xsl:value-of select="cbc:ID"/>
															</td>
														</tr>
													</xsl:if>
													<xsl:if test="cbc:IssueDate !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px; background-color: #00AF33; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye Tarihi :</xsl:text>
																</span>
															</td>
															<td style="background-color: #00AF33;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
																<span>:</span>
															</td>
															<td align="left">
																<xsl:for-each select="cbc:IssueDate">
																	<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
																</xsl:for-each>
															</td>
														</tr>
													</xsl:if>
												</xsl:for-each>
											</xsl:if>
										</tbody>
									</table>
								</td>
							</tr>
							<tr align="left">
								<table id="ettnTable" style="width:377px; margin-bottom:5px">
									<tr style="height:13px;">
										<td align="left" valign="top" style="width:40px ;padding: 5px; color:black;">
											<span style="font-weight:bold; ">
												<xsl:text>ETTN :</xsl:text>
											</span>
										</td>
										<td align="left" style="color:dimgray; font-weight:bold ">
											<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cbc:UUID">
													<xsl:apply-templates/>
												</xsl:for-each>
											</xsl:for-each>
										</td>
									</tr>
								</table>
							</tr>
						</tbody>
					</table>
				
					
					
					
					
					
										<div id="lineTableAligner">
						<span>
							<xsl:text>&#160;</xsl:text>
						</span>
					</div>
						<table id="lineTable" width="793" style="border:0px; border-color: gray;">
						<tbody>
							<tr id="lineTableTr">
								<td id="lineTableTd" style="width:3%">
									<span style="font-weight:bold; " align="center">
										<xsl:text>Sıra No</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:20%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7.4%" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Miktar</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:9%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Birim Fiyat</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:9%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:10%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:17%; " align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Diğer Vergiler</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:10.6%" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet Tutarı</xsl:text>
									</span>
								</td>
							</tr>
							<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &gt;= 20">
								<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
									<xsl:apply-templates select="."/>
								</xsl:for-each>
							</xsl:if>
							<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &lt; 20">
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[1]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[1]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[2]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[2]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[3]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[3]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[4]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[4]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[5]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[5]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[6]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[6]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[7]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[7]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[8]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[8]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[9]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[9]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[10]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[10]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[11]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[11]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[12]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[12]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[13]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[13]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[14]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[14]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[15]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[15]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[16]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[16]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[17]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[17]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[18]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[18]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[19]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[19]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[20]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[20]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:if>
						</tbody>
					</table>
					
					
					
					
				</xsl:for-each>
				<xsl:variable name="allowTotStyle">
					<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount != 0">min-height:121px;</xsl:if>
				</xsl:variable>
				<table style="margin-left:-3px; margin-right:-3px;">
					<tbody>
						<tr>
							<td style="width:59%; vertical-align:top">
								<table id="notesTable" align="left" width="100%" style="height:auto;min-height: 97px;{$allowTotStyle}border: 1px solid gray;padding-bottom:15px;">
									<tbody>
										<tr align="left" valign="top">
											<td id="notesTableTd" style="padding:10px; width:60%">
												<xsl:for-each select="n1:Invoice/cbc:Note">
													<xsl:if test="not(contains(., '#')) and not(contains(., 'Yazı ile yalnız :')) and . !='' ">
														<b>Not :&#xA0;</b>
														<xsl:value-of select="."/>
														<br/>
													</xsl:if>
												</xsl:for-each>
												<xsl:for-each select="//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
												<xsl:if test="cbc:Percent=0 and cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;0015&apos;">
												<b>&#160;&#160;&#160;&#160;&#160; Vergi İstisna Muafiyet Sebebi: </b>
										<xsl:value-of select="cac:TaxCategory/cbc:TaxExemptionReason"/>
												<br/>
												</xsl:if>
												</xsl:for-each>
												<xsl:for-each select="n1:Invoice/cac:PaymentMeans">
													<xsl:if test="cbc:InstructionNote !=''">
														<b>Ödeme Notu :&#xA0;</b>
														<xsl:value-of select="//n1:Invoice/cac:PaymentMeans/cbc:InstructionNote"/>
														<br/>
													</xsl:if>
													<xsl:if test="cbc:PaymentNote !=''">
														<b>Hesap Açıklaması :&#xA0;</b>
														<xsl:value-of select="//n1:Invoice/cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:PaymentNote"/>
														<br/>
													</xsl:if>
												</xsl:for-each>
											</td>
										</tr>
										<tr align="left" valign="top">
											<td id="notesTableTd" style="padding-left:10px; padding-bottom:10px">
												<xsl:for-each select="n1:Invoice/cac:PaymentMeans">
													<xsl:if test="cbc:PaymentDueDate !=''">
														<b>VADE TARİHİ :&#xA0;</b>
														<xsl:for-each select="cbc:PaymentDueDate">
															<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
														</xsl:for-each>
														<br/>
													</xsl:if>
												</xsl:for-each>
												<xsl:for-each select="n1:Invoice/cac:TaxExchangeRate">
													<xsl:if test="cbc:CalculationRate !=0">
														<xsl:if test="cbc:SourceCurrencyCode = 'USD'and cbc:TargetCurrencyCode = 'TRY'">
															<b>1 DOLAR =</b>
															<xsl:value-of select="cbc:CalculationRate"/>
															<b>&#xA0; TL OLARAK ALINMIŞTIR</b>
														</xsl:if>
													</xsl:if>
												</xsl:for-each>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style="vertical-align:top">
								<table id="budgetContainerTable" width="100%" style="margin-top:0px">
									<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" align="right" style="background-color: #00AF33; color: white;width:68%">
											<span style="font-weight:bold; ">
												<xsl:text>Mal Hizmet Toplam Tutarı</xsl:text>
											</span>
										</td>
										<td id="lineTableBudgetTd" style="width:32%;" align="right">
											<span>
												<xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
												<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID">
													<xsl:text> </xsl:text>
													<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRY'">
														<xsl:text>TL</xsl:text>
													</xsl:if>
													<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
														<xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID"/>
													</xsl:if>
												</xsl:if>
											</span>
										</td>
									</tr>
									<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount != 0">
										<tr id="budgetContainerTr" align="right">
											<td id="lineTableBudgetTd" align="right" width="200px" style="background-color: #00AF33; color: white">
												<span style="font-weight:bold; ">
													<xsl:text>Toplam İskonto</xsl:text>
												</span>
											</td>
											<td id="lineTableBudgetTd" style="width:104px; " align="right">
												<span>
													<xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount, '###.##0,00', 'european')"/>
													<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID">
														<xsl:text> </xsl:text>
														<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID = 'TRY'">
															<xsl:text>TL</xsl:text>
														</xsl:if>
														<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID != 'TRY'">
															<xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID"/>
														</xsl:if>
													</xsl:if>
												</span>
											</td>
										</tr>
									</xsl:if>
									<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
										<tr id="budgetContainerTr" align="right">
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
												<span style="font-weight:bold; ">
													<xsl:text>Hesaplanan </xsl:text>
													<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
													<xsl:text>(%</xsl:text>
													<xsl:value-of select="cbc:Percent"/>
													<xsl:text>)</xsl:text>
												</span>
											</td>
											<td id="lineTableBudgetTd" style="width:104px; " align="right">
												<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
													<xsl:text> </xsl:text>
													<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
													<xsl:if test="../../cbc:TaxAmount/@currencyID">
														<xsl:text> </xsl:text>
														<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
															<xsl:text>TL</xsl:text>
														</xsl:if>
														<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
															<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
														</xsl:if>
													</xsl:if>
												</xsl:for-each>
											</td>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal">
					<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
		
								<span style="font-weight:bold; ">
									<xsl:text>KDV Tevkifatı </xsl:text>
									<xsl:text>(%</xsl:text>
									<xsl:value-of select="cbc:Percent"/>
									<xsl:text>)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:104px; " align="right">
								<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
									<xsl:text> </xsl:text>
									<xsl:value-of
										select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
									<xsl:if test="../../cbc:TaxAmount/@currencyID">
										<xsl:text> </xsl:text>
										<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
											<xsl:text>TL</xsl:text>
										</xsl:if>
										<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
											<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
										</xsl:if>
									</xsl:if>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:for-each>
						<xsl:if
						test="sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount)>0">
<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:104px; " align="right">
								<xsl:value-of
									select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Üzerinden Hes. KDV</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:104px; " align="right">
								<xsl:value-of
									select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
					</xsl:if>					
					<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:104px; " align="right">
								<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test = "//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								</xsl:if>								
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRY' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text> TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
	<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Üz. Hes. KDV</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:104px; " align="right">
								<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test = "//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRY' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text> TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
					</xsl:if>
					<tr id="budgetContainerTr" align="right">
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
												<xsl:text>Beyan Edilecek KDV</xsl:text>
											</span>
										</td>
										<td align="right" id="lineTableBudgetTd" style="width:104px; ">
							<xsl:for-each select="n1:Invoice">
								<xsl:for-each select="cac:TaxTotal">
									<xsl:for-each select="cbc:TaxAmount">
										<xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
										<xsl:if test="//n1:Invoice/cac:TaxTotal/cbc:TaxAmount/@currencyID">
											<xsl:text> </xsl:text>
											<xsl:if test="//n1:Invoice/cac:TaxTotal/cbc:TaxAmount/@currencyID = 'TRY'">
												<xsl:text>TL</xsl:text>
											</xsl:if>
											<xsl:if test="//n1:Invoice/cac:TaxTotal/cbc:TaxAmount/@currencyID != 'TRY'">
												<xsl:value-of select="//n1:Invoice/cac:TaxTotal/cbc:TaxAmount/@currencyID"/>
											</xsl:if>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
							</xsl:for-each>
						</td>
					</tr>
									<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #00AF33; color: white">
											<span style="font-weight:bold; ">
												<xsl:text>Vergiler Dahil Toplam Tutar</xsl:text>
											</span>
										</td>
										<td id="lineTableBudgetTd" style="width:104px; " align="right">
											<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:LegalMonetaryTotal">
													<xsl:for-each select="cbc:TaxInclusiveAmount">
														<xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
														<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID">
															<xsl:text> </xsl:text>
															<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRY'">
																<xsl:text>TL</xsl:text>
															</xsl:if>
															<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRY'">
																<xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID"/>
															</xsl:if>
														</xsl:if>
													</xsl:for-each>
												</xsl:for-each>
											</xsl:for-each>
										</td>
									</tr>
									<tr id="budgetContainerTr" align="right">
										<td id="lineTableBudgetTd" style=" background-color: #00AF33; color: white; width:200px" align="right">
											<span style="font-weight:bold; ">
												<xsl:text>Ödenecek Tutar</xsl:text>
											</span>
										</td>
										<td id="lineTableBudgetTd" style="width:104px; " align="right">
											<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:LegalMonetaryTotal">
													<xsl:for-each select="cbc:PayableAmount">
														<xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
														<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID">
															<xsl:text> </xsl:text>
															<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRY'">
																<xsl:text>TL</xsl:text>
															</xsl:if>
															<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRY'">
																<xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID"/>
															</xsl:if>
														</xsl:if>
													</xsl:for-each>
												</xsl:for-each>
											</xsl:for-each>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<table id="notesTable" align="left" width="100%" style="height:auto;border: 1px solid gray; ">
									<tbody>
										<tr align="left" valign="top">
											<td id="notesTableTd" style="padding:5px 10px; width:60%">
												<xsl:for-each select="n1:Invoice/cbc:Note">
													<xsl:if test="contains(., 'Yazı ile yalnız :')">
														<b>
															<xsl:value-of select="normalize-space(substring-before(.,':'))"/>:&#xA0;</b>
														<xsl:value-of select="normalize-space(substring-after(.,':'))"/>
														<br/>
													</xsl:if>
												</xsl:for-each>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<table id="hesapBilgileri" style="border-top: 1px solid darkgray;padding:10px 0px; border-bottom:2px solid #00AF33;width:100%; margin-top:5px">
									<tr>
										<td style="width:100%; padding:0px">
											<fieldset style="margin:2px">
												<legend style="background-color:white">
													<b>BANKA HESAP BİLGİLERİMİZ</b>
												</legend>
												<table style="width:100%" id="bankingTable" border="1">
<!--<table border="0" width="800px" id="bankingTable" style="font-size: 11px; font-weight: bold; margin-left:-11px">-->
	<tr>
		<th style="width: 110px" align="left">
			BANKA ADI
		</th>
		<th style="width: 160px" align="left">
			ŞUBE ADI / KODU
		</th>
		<th style="width: 80px" align="left">
			BANKA HESAP NO
		</th>
		<th style="width: 220px" align="left">
			IBAN
		</th>
	</tr>
	<tr>
		<td>İŞ BANKASI  (TL)</td>
		<td>EDİRNE  (1300)</td>
		<td align="left">1370296</td>
		<td>TR50 0006 4000 0011 3001 3702 96</td>
	</tr>
	<tr>
		<td>İŞ BANKASI  (EURO)</td>
		<td>EDİRNE  (1300)</td>
		<td align="left">0680367</td>
		<td>TR21 0006 4000 0021 3000 6803 67</td>
	</tr>


												<!--	<tr>
														<td style="width:25%">
															<b>BANKA ADI</b>
														</td>
														<td style="width:25%">
															<b>ŞUBE ADI / KODU</b>
														</td>
														<td style="width:25%">
															<b>BANKA HESAP NO</b>
														</td>
														<td style="width:25%">
															<b>IBAN</b>
														</td>
													</tr>
													<tr>
														<td>
															<b>GARANTİ BANKASI TL</b>
														</td>
														<td>TR56 0006 4000 0011 3870 0144 03</td>
													</tr>
													<tr>
														<td>
															<b>YAPIKREDİ TL</b>
														</td>
														<td>TR39 0006 7010 0000 0028 0348 21</td>
													</tr>
													<tr>
														<td>
															<b>HALKBANK TL</b>
														</td>
														<td>TR76 0004 6012 0888 8000 0020 04</td>
													</tr>
													<tr>
														<td>
															<b>DENİZBANK A.Ş.</b>
														</td>
														<td>TR74 0006 2000 1400 0006 2929 22</td>
														<td/>
													</tr>
													<tr>
														<td>
															<b>BURGANBANK TRY</b>
														</td>
														<td>TR74 0006 2000 1400 0006 2929 22</td>
														<td/>
													</tr>-->
												</table>
											</fieldset>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="dateFormatter">
		<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
	</xsl:template>
	<xsl:template match="//n1:Invoice/cac:InvoiceLine">
		<tr id="lineTableTr">
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cbc:ID"/>
				</span>
			</td>
			<!--<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cac:BuyersItemIdentification/cbc:ID"/>
				</span>
			</td>-->
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Name"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:BrandName"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:ModelName"/>
					<!--<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Description"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cac:BuyersItemIdentification/cbc:ID"/>-->
				</span>
			</td>
			<!--<td id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:value-of select="./cbc:Note"/>
				</span>
			</td>-->
			<td id="lineTableTd" align="center">
				<span>
					<xsl:value-of select="format-number(./cbc:InvoicedQuantity, '###.###,####', 'european')"/>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text/>
					<!--<xsl:value-of select="format-number(./cbc:InvoicedQuantity, '###.###,##', 'european')"/>-->
					<xsl:if test="./cbc:InvoicedQuantity/@unitCode">
						<xsl:for-each select="./cbc:InvoicedQuantity">
							<xsl:text/>
							<xsl:choose>
								<xsl:when test="@unitCode  = '26'">
									<span>
										<xsl:text>Ton</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'BX'">
									<span>
										<xsl:text>Kutu</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'NIU'">
									<span>
										<xsl:text>Adet</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'C62'">
									<span>
										<xsl:text>Adet</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KGM'">
									<span>
										<xsl:text>KG</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KJO'">
									<span>
										<xsl:text>kJ</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'GRM'">
									<span>
										<xsl:text>G</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MGM'">
									<span>
										<xsl:text>MG</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'NT'">
									<span>
										<xsl:text>Net Ton</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'GT'">
									<span>
										<xsl:text>GT</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTR'">
									<span>
										<xsl:text>M</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MMT'">
									<span>
										<xsl:text>MM</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KTM'">
									<span>
										<xsl:text>KM</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MLT'">
									<span>
										<xsl:text>ML</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MMQ'">
									<span>
										<xsl:text>MM3</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CLT'">
									<span>
										<xsl:text>CL</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMK'">
									<span>
										<xsl:text>CM2</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMQ'">
									<span>
										<xsl:text>CM3</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMT'">
									<span>
										<xsl:text>CM</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTK'">
									<span>
										<xsl:text>M2</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTQ'">
									<span>
										<xsl:text>M3</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'DAY'">
									<span>
										<xsl:text> Gün</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MON'">
									<span>
										<xsl:text> Ay</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'PA'">
									<span>
										<xsl:text> Paket</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'PR'">
									<span>
										<xsl:text> Çift</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KWH'">
									<span>
										<xsl:text> KWH</xsl:text>
									</span>
								</xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:if>
				</span>
			</td>
			<td id="lineTableTd" align="center">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="format-number(./cac:Price/cbc:PriceAmount, '###.##0,00', 'european')"/>
					<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test='./cac:Price/cbc:PriceAmount/@currencyID = "TRY" '>
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test='./cac:Price/cbc:PriceAmount/@currencyID != "TRY"'>
							<xsl:value-of select="./cac:Price/cbc:PriceAmount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:if test="./cac:AllowanceCharge/cbc:MultiplierFactorNumeric">
						<xsl:text> %</xsl:text>
						<xsl:value-of select="format-number(./cac:AllowanceCharge/cbc:MultiplierFactorNumeric * 100, '###.##0,00', 'european')"/>
					</xsl:if>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:if test="./cac:AllowanceCharge">
						<!--<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = true() ">+
									</xsl:if>
					<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = false() ">-
									</xsl:if>-->
						<xsl:value-of select="format-number(./cac:AllowanceCharge/cbc:Amount, '###.##0,00', 'european')"/>
					</xsl:if>
					<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID = 'TRY'">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID != 'TRY'">
							<xsl:value-of select="./cac:AllowanceCharge/cbc:Amount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0015' ">
								<xsl:text> </xsl:text>
								<xsl:if test="../../cbc:Percent">
									<xsl:text> %</xsl:text>
									<xsl:value-of select="format-number(../../cbc:Percent, '###.##0,00', 'european')"/>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='4080' ">
								<xsl:text>Ö.İLETİŞİM V / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0015' ">
								<xsl:text> </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
			</td>
			<!--<td align="right" id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0003' ">
								<xsl:text>STPJ / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0061' ">
								<xsl:text>KKDF KESİNTİ / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0071' ">
								<xsl:text>ÖTV 1.LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0073' ">
								<xsl:text>ÖTV 3.LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0074' ">
								<xsl:text>ÖTV 4.LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0075' ">
								<xsl:text>ÖTV 3A LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0076' ">
								<xsl:text>ÖTV 3B LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='0077' ">
								<xsl:text>ÖTV 3C LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='1047' ">
								<xsl:text>DAMGA V / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='1048' ">
								<xsl:text>5035SKDAMGAV / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='4080' ">
								<xsl:text>Ö.İLETİŞİM V / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='4081' ">
								<xsl:text>5035ÖZİLETV. / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='9015' ">
								<xsl:text>KDV TEVKİFAT / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='9021' ">
								<xsl:text>4961BANKASMV / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='9077' ">
								<xsl:text>ÖTV 2.LİSTE / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8001' ">
								<xsl:text>BORSA TES.ÜC. / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8002' ">
								<xsl:text>ENERJİ FONU / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8003' ">
								<xsl:text>BEL.TÜK. VER / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8004' ">
								<xsl:text>TRT PAYI / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8005' ">
								<xsl:text>ELK.TÜK.VER. / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8006' ">
								<xsl:text>TK KULLANIM / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8007' ">
								<xsl:text>TK RUHSAT / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
				<span>
					<xsl:text> </xsl:text>
					<xsl:for-each select="./cac:TaxTotal">
						<xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
							<xsl:if test="cbc:TaxTypeCode='8008' ">
								<xsl:text>ÇEV. TEM .VER. / </xsl:text>
								<xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
								<xsl:if test="../../cbc:TaxAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRY'">
										<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
									</xsl:if>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</span>
			</td>-->
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="format-number(./cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
					<xsl:if test="./cbc:LineExtensionAmount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cbc:LineExtensionAmount/@currencyID = 'TRY' ">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cbc:LineExtensionAmount/@currencyID != 'TRY' ">
							<xsl:value-of select="./cbc:LineExtensionAmount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</span>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="//n1:Invoice">
		<tr id="lineTableTr">
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>
			<!--<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>-->
			<!--<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>-->
			<!--				<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#xA0;</xsl:text>
				</span>
			</td>-->
		</tr>
	</xsl:template>
	<xsl:template name="ShowEmployeesInTeam">
		<xsl:param name="lstInvoiceQ"/>
		<xsl:if test="sum($lstInvoiceQ) !=0">
			<xsl:value-of select="sum($lstInvoiceQ)"/>
			<xsl:text>&#xA0;</xsl:text>
			<xsl:if test="$lstInvoiceQ[1]/@unitCode">
				<xsl:choose>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = '26'">
						<span>
							<xsl:text>Ton</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'BX'">
						<span>
							<xsl:text>Kutu</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'LTR'">
						<span>
							<xsl:text>LT</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'NIU'">
						<span>
							<xsl:text>Adet</xsl:text>
						</span>
					</xsl:when>
							<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'C62'">
						<span>
							<xsl:text>Adet</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'KGM'">
						<span>
							<xsl:text>KG</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'KJO'">
						<span>
							<xsl:text>kJ</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'GRM'">
						<span>
							<xsl:text>G</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MGM'">
						<span>
							<xsl:text>MG</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'NT'">
						<span>
							<xsl:text>Net Ton</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'GT'">
						<span>
							<xsl:text>GT</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MTR'">
						<span>
							<xsl:text>M</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MMT'">
						<span>
							<xsl:text>MM</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'KTM'">
						<span>
							<xsl:text>KM</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MLT'">
						<span>
							<xsl:text>ML</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MMQ'">
						<span>
							<xsl:text>MM3</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'CLT'">
						<span>
							<xsl:text>CL</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'CMK'">
						<span>
							<xsl:text>CM2</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'CMQ'">
						<span>
							<xsl:text>CM3</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'CMT'">
						<span>
							<xsl:text>CM</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MTK'">
						<span>
							<xsl:text>M2</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MTQ'">
						<span>
							<xsl:text>M3</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'DAY'">
						<span>
							<xsl:text> Gün</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'MON'">
						<span>
							<xsl:text> Ay</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'PA'">
						<span>
							<xsl:text> Paket</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'PR'">
						<span>
							<xsl:text> Çift</xsl:text>
						</span>
					</xsl:when>
					<xsl:when test="$lstInvoiceQ[1]/@unitCode  = 'KWH'">
						<span>
							<xsl:text> KWH</xsl:text>
						</span>
					</xsl:when>
				</xsl:choose>
			</xsl:if>
			<xsl:if test="position() !=last()">
				<xsl:text> + </xsl:text>
			</xsl:if>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
