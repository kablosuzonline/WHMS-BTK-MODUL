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
			background-color:#DAA520;
			color: white;
			}
					</style>
				<title>e-Arşiv Fatura</title>
			</head>
			<body style="margin-left=0.6in; margin-right=0.6in;  margin-bottom=0.79in;border-top: 2px solid #DAA520;height:auto; width:793px; margin-top:10px">
				<xsl:for-each select="$XML">
					<table cellspacing="0px" width="793" cellpadding="-20px" style="border-bottom:2px solid #DAA520; padding-top:10px;padding-bottom:10px">
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
									<table id="customerPartyTable" align="left" border="0" height="50%" style="margin-bottom: 5px;border: 1px solid #DAA520; border-left-width:5px; width:95%; margin-left:-2px">
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
									<img style="width:91px; margin-top:20px" align="middle" alt="E-Fatura Logo" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QDwRXhpZgAASUkqAAgAAAAKAAABAwABAAAAwAljAAEBAwABAAAAZQlzAAIBAwAEAAAAhgAAAAMBAwABAAAAAQBnAAYBAwABAAAAAgB1ABUBAwABAAAABABzABwBAwABAAAAAQBnADEBAgAcAAAAjgAAADIBAgAUAAAAqgAAAGmHBAABAAAAvgAAAAAAAAAIAAgACAAIAEFkb2JlIFBob3Rvc2hvcCBDUzQgV2luZG93cwAyMDA5OjA4OjI4IDE2OjQ3OjE3AAMAAaADAAEAAAABAP//AqAEAAEAAACWAAAAA6AEAAEAAACRAAAAAAAAAP/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/bAEMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAGYAaQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP7+KKKQ/wAh/nnp+H5kUALXjfxk/aB+DX7P+gJ4j+L/AMQ/DngmxuH8jS7PU76Ntd8QXrYEWmeGfDlt5+u+I9UmZlWHTtF0+9u3LD91tyw+UPi5+1h4y8deLPFXwY/ZNPhV9T8GXC6X8Z/2mPHsyR/BL4A3E21J9JVpLmwj+JPxSt4p4biDwPpep2Ol6WZIn8W+INH823tbr80Ln4xeCvBPiXx9b/sheGrj9rn9v/4b/tD+Dfg98S/iF+0dYTaj4p8QWmv2/iuWXV/htey32n+HPh58LNR8Q+DNY8CHWfBaaP4Z8LPbT6nqdrrF3Z6cmqfY5TwniMU4zxiqU1alOWHjOnQdClXnCnRr5pja6lhsnwtSdWmoTxEauIn7SlJYVUasK55OKzOFP3aPLL4kqjTnzyinKUMPRg1UxE4xUm1HlgrP35Si4n6B/ED9t74833g/WPHPwn/Zg1b4ffDbSY4Jrv4zftc6nqXwh8OwWVzcRW0WqWnwu8PaJ4y+MFzZP9ohnjl13wz4TjjRZG1N9MtEa9XyHVPi38dtb8Uy+DPFP/BSb4LeDfGiR2t7c/D79m/9nfSfF2uWmial4L1T4hWOuPefEnxF46vrnwzd+DNHv9ZsvG1vpNh4fvI0iS1kF1c21rJ6H4U/Z8/al+O/gX9pD4eftELovhr4J/tQ2t54ktfB3xA8QL8Tvi98Br/xp8M9L8NeJfhh4ZOhTy/D2Xw74L8d6WfGfgnxHD4n1IQi+vLaPw9Zy3UM+lfVnhj9j74XaXq/wn8ZeK5dY+IHxO+FPwS1r4Bw/EbW5LPTdc8X+BvEVrolprMfi638P2mmWF/fXCaFbyWs8MNsNPlu9Tls0je/mY9M8XkOXU50Y0MG60XUivqVGhmTknh6FTDzqYzNKWLpqpTxKxGHxawfsIStSq4eDp83PmqONxDUnKpytRb9tOdFJ88lNKlh5U3Zw5J0+fmktYTlfb4H+CH9p/tF/CPxD8ffhx/wU3/ah1H4feGtNm1jVfEjeCf2erLT0tbbwvaeMLq6Tw9b/De/utP8jQ761vp9D1WOx1ezFxHb3VlDIy7sD4VfHD40eOfhr4p+Mvwd/wCCoHwn8Y/DrwNPokfiu/8A2sP2bfDfgHRfDo8RaRp2vaBDrnirwhr3wmbTINb0jVdNvLLWJ4dRijgv4pntrhtkB/UT4f8A7LvwT+F3wh1f4D+CvDWuaf8ACbWvDE/gu58Ial8Q/iR4ntrPwncaCfDD+HtA1DxT4t1rWPC+kx6EfsFrZeGtR0qCyQLNZpBcIky/JPiz/gkt+yTr/wAKPEHwd0Ox+Ivgvwd4jWS41Cw0b4keK9Sgu9Xsfh2/wx8GanqcHiXUNZGrReAPDLCLw5o17I2iz3Crc69YaxcRW0tvpQzvIK+IxUMXLG08LLMKH1CpVybIcY6GWc0vrKxWHWGgquNlDlVGdCtTpwkm2pKXuTPBY2EKTpKjKoqMvbKOJxdK+I05HTnzSSpLVyU05PoXov2pv2wPhFDHc/tBfslR/FHwh9ngvH+Kf7FPi6T4uwR6bcxGa31O9+EXivT/AAf8SXtpoNlwR4Ri8ZysrlbCDUI4zOfqv4FftRfAX9pTSrrU/g18SvD3i650pzB4i8MpcPpfjjwjergS6d4w8D6vHY+K/C9/E7CN7bW9JsnZsmLzEwx/P1/2M/2jvg18arf40eGPjF8R/jP4Hh8HeEfCer/BzwbrOifCjxDq2k/BT4b6dp3wksG13VtWfTtWbXfHz+NL7x/aw634L0XWNP8AF+jjUbO+t/B62urfIeo/FX4XfFyNvFv7afge9/ZB/bCu/wBr69/Zu+B3xI/Z0t9WsPi94Wt7jQ/hpcaVrvjHxRpUl3pvjv4c6P47+Ilr4I8S6x4ittV+GeuTvoty+k2/25pLenkeWZrTdTAyo1ZKlhnOtk/tfawr1qVSpUhXyLF1Z4ypHDewqyxWJwM6OHpU3CpSoVnL2bSxmIwr5a3PHWfLHFWalGMoRi4YunFU4yqc6VOnWTnKV+aUVqf0eUV+YPwv/a3+JfwP8U+EPg3+2tP4b1XSPG+qx+Gfgj+2b4Djgg+D3xl1R5XgsvDXxB0uxmv7X4N/FC5dVs4LK+1GfwZ4t1JLiDwxq6X0cmkx/p6CCAQcg8gjoR6j1B7Hv1FfG47L8Rl84xrKE6VVOWHxVGXtMNiYRdpSo1LJ3g/dq0qkYV6E7069KnUTivWoYiniItxvGUWlUpzVp05NXtJbNNaxlFuE1aUZNO4tFFFcJuFfmn+1h8c/EPjvxprH7LPwf8bP8PLPQfDsPi79rD9oGxdRJ8A/hbexSzWHh/wvdss1r/wuL4lR2txYeGLeaC6fw5or33il7S4uYdKs7r6g/as+PVp+zh8DvGPxLWwfXfFEcNp4Z+GvhGDLX/jj4p+LbqPw/wDDzwZpsADSz3fiHxTf6bYhIY5ZVgkmlSKRoxG35+eAPhJ8PPE/7MX7Rv7LFx4j8RfEj9pK51/wj40/ag1z4WeNvCnh34m6h8fvGmo+E/iBNr3h281XVJV0TTvhxPb+HrXRbfW7GLR18L+GbfQY4dXnGowTfV5BgqdCl/bWLpTlRp4mjh8NJUlVhh5Ovh6eKzWtCdqUqOXLEUVRhWkqVbH4jDxnzUqVaEvMx1Zzk8JTklJ05VKi5uV1NJOnh4NXkpVuSbm4+9GlCbjaUotfT17+zx+yt8Tf2dl/YisfAWu6X8JvH3wn1HWE0+Dwx4i0u60a1N3oUi+INf8AE2raWV0v4tTaz4i07xXHZ+LJm8Wa1eRalrGoadfWltqRHtn7Pf7MXwg/Zs8FeF/Cnw78GeFtP1PQPDFv4a1DxpZ+E/DWh+KPE0f2+61rU7vV7vQtMsEVNX8R6hqfiCfSrNLfR7TUdRuGsLG1j2Rr1fwa+EemfB3wpLoNv4i8UeNdd1jUn8Q+NPH3ji+tNS8Y+OPFM9hp+l3Gv+ILrT7LTNMW4GmaTpWk2VjpOm6dpWl6Tpen6dp9lBbWqLXrVeRi8yxU4V8HTx+Mr4Gpip4qcatWpy4nFTSjUxU6cnfnqxjBSc7ykoQlNcySj00cPTThWlRpRrKnGCcYq9OmtVTUkldRbbulpzNLTVozKiszEKqgszMQFAAySSeAAOSe1fzrf8FOv+CkN/Hdav8AAv4DeK73QE0a48vxz8R/D+q3el6hHe24jlOh+G9X026gng8h9yanewyBjIrWsTACU19jf8FTP2yn+AHw3j+GXgjUlt/if8RrK4iW5gkjM/hvwu/m21/qzKdzR3N0yvZ6eSqlXMs6t+5r+Kv4u/EWa6nn0ewuXdTI7Xc5fdJPNIdzySOcs7sxYsxJLEknOa/DfEbjKWXwnkuXVHHESivruIpytOlGVnHD05JpxnJe9VkmnGLUVZt2/wBRvoJ/RUo8bYjC+K3HGXwxOTYfESXCeUY2iqmFx1bDz5K2d42jUThXwlCpGVHAUKidOvXjUrzjKFKlze86z+2f+0LFeXAj/as+PKojvxH8XvHgUYYj7q67x0x0xx6V5Nrv7fn7T731tovhr9pT9orV9Yv547OxtbT4tfEKae5uZ3EcUUUEevF5HZ3VR8oGSDnANfEHiPWboSw6ZpkU97quoTR2tra28bTXNzczv5ccUUceXkeRjsRVXqQQcYNf0qf8Er/+CXun+D9PX46fHWytf+Emj05tclGqqRY+CdHhX7XKGExEI1IQR+Zc3Dr+45jjZcMT+Y8N4LiDiTGeypZjjaGEp2lisS8ViOSjDRtXdVJzaTajpdJydknb+/fpA8beDPgDw5DF4rgjhLOOJMdfC8P5BDh3JHiMxxr5IxbhDAucMNTqTg6tSzbco0oRlUlFP3T/AIJn/BL9rbxJ4m8OfFL9o79pD9pDUVjeHVNI+HC/F3xxc6GqSwSGJfFtveavPHqDESI4sFHkRsuJhLgAf0FftBfss/Cz9qr4Z+IvA3xCsNQ0S/8AEuh6doY+Ivg3+ytF+J+g6fpvibQ/GFtb+HvGN1pGp3ulx/8ACQ+HNH1KSJI5Yjd2NvexJHfW1pdQfiT4s/4LRfAz9nj4qaD4K0f4RXusfC46odH1X4hRarDb36xQy/ZW1jTtJa3dbmwR2WYrJe28r2xaRULhUb+jLwX4u8P+OvDGh+LPC97DqGheINLstX0y7gYNHPZX8CXNtKrAn70cikgnIJIPIr+huCcyy3BKVLh3Nq9XGZXXpTrYn21eWJjiINShWVWq/fi5R91070tLJd/8VvpJZD4s1s2yji7xT4Nw/CuC4uwdavw7gcDgMrwGV0cDGSlLBU8HliUcJiKMasJVaWMisZJTVSpe7t+M1xB8Mf2XfgJ8cvhb+3Daz+J/B3xE8daX8Kvg9+zL4V0weI/C1/8ACTRptL0HwHZ/s3+ELdrrxx4q8VppGt2Xiv4j61PHB4ng+I1ncvbeSthpGt6t7p+zL8VPHP7NPxX8MfsWfHnxPrPjbwZ450O68Q/sY/HvxV58eveN/Bmm2cV1cfA74rXd+lrO3xo8B6WPtWnalPa2knjjwmkdzLBH4i0rV4Zfuf43/Ca3+KXhDUBo50nRPipoGgeNB8H/AIkXml2+oar8MvGvijwhq/hSLxRocssUs1rMlpqssF6sH/H1Zs8TpJhAPwq8Nfsxa74t8Ka98KPjv8RPFvwP+Jfii/0/wn+yfpPxR+NelfFb4n2/7RHwcuvGXxB8L/FrRdZnfX/EVl4aknOq6v4e0l/FGlG7tvF3jvQb3wynh3XvBHh3w/8AteBrYLPcBjXjaypVKlR1cfRVqs4V3CFOhmeW4WlThOjTwdCjKpmL5sRLFUfrKxUqLhha5/KFaFbA16KpR5opRjRm24KULtzw9ao21OdWbtRVoqnL2fIpe/F/0eUV8l/sS/tE337TH7P3hjx14o0uPw18UtBv9d+HHxs8FjCXHgz4v/D7VLjw1430Wa3+9Ba3Oo2I17Qi4Au/DesaPfR5iuVNfWlfBYvC1sFicRhMRFRrYatUo1UnzR56cnFuMtpQlbmhJaSi1JaO57dKpCtTp1YO8KkIyj6NXs10a2a6NNH5s/GVR8c/+CgX7O/wUlxP4O/Zq8D6z+1r42tyPMt7rx5qN9P8M/gnp17C+YxJaTXnjvxfp0rK7RXXhoSqEnjtZl+l/Cn7I37N/gn4p23xy8L/AAj8J6V8ZINP8VaXP8T7e1mXxrrNn401eXXfEUfiXXBOLrxRJeapPcXFvc+IW1K60tLi5ttKmsra6uIZPmf9kknxf+2j/wAFHviXOC7aZ8Qvgv8AA/SnOCLfTPht8KdP1u/tFPUh9d8b398y8BXuyNozk/pPXt5ziMRg54XLaFatQo4bKMBRrUqdSdONWpjMOsxxarKDiqsZYjHVYe/zJ0owi9IpLkwkIVY1MROEZzqYmtUjKUU3FU5+xpcravFxp0obfa5tdWFYfibxBpvhPw9rXibWbhbXStB0y91XULl87YbSxt3uJ3OAT8scbEAAkngckVuV+Yf/AAVu+L03wt/ZB8W6dp919m1j4j3+n+CbMrIUlNnfzrNrDREMGBXToZlJXOPM5wDmvjc0xsMty7G4+duXCYarWs9pShFuEf8At6fLH5n6D4ecJYnjzjnhPg3CcyrcR59luVc8Vd0qOKxMIYmvbb9xhva1nfS0NWkfyp/tu/tL6z8aPil8Qfirql3I/wDbmqXem+F7Z3cx6d4Xsrm4h0a0gR+Y1+zEXEqAKDcXErHOTX5La9qzRxXV/cOS7B23NyScH1z+PXA+gr3D4va01zqUGmo58q2jG4ZyNxLZ6/jgemcYxXz7H4f1Px54v8MeAdFjabUvE+tadottHGu5jNf3MUGQANxCCQucjICk49P48x2IxGbZnOpOUq1fFYhtv4nOrVmr2Sb3k+VLpoklsf8AUbwxlOR+Gnh/hcPhKVHLspyDJadGjFKMKeGy/LcKkm9Ely0aUqlSTfvScpScm23+pP8AwSI/Y2m+OvxIl+NnjHRZNQ0Dw9qLab4Ks7uJXtLzVwAbnVHjkyJF0+N9tsSoUTuXBOwV/Ub/AMFGri5/Z3/4J8/ES88PLLZ3OqLofhjVLq1UrMmma9fJZ6iC8XzKktu7Qu3ZWOT2r5S+BXx//ZX/AOCcXhTwT8HfHGkeNrzxH4e8FeH76/PhPw9ZataW8+pWEU7vdyzapZTi+uJd9zIphJWOSLLk8H0j40f8FXP2AP2kvhN40+EHjnRPi3N4Y8YaNc6XeLL4PsLa4tWkiYW99ayvrriK7spilxbyYO2RAcEZB/fcCshyPh3GZFDOMBhc1q4OvSrSqVVGpHG1KTUlNpacs2qa1vGKVtd/8VeJ4eM3i347cL+MeN8L+M+IvDvA8VZNmmVUsHl08RhsRwpgMxpVaDwdOc+STxOHg8Xqkq9ao2/d5bfxX/Hz4gS+MdQ0nTNLMly5SOztII0YyTXV1NGqqq4BLM+1V6cnn1H+hV/wTHXxLpv7LPwp8OeKpJ5NW0PwRodncickyRyJaRN5LZJ5gVhEeeCuCOK/lC/ZG+Bn7EHxE/bC0bwT4C1f4p/ELxGs+sap4Vt/F/hjRtO8O6ZbaNbz3ktxqUtnqt3NcXNvCoEEgtfKadUJjTOR/br8G/AkHgbwvZ6fCqqRAgbaMKeFwAMDAG30rm8L8lqYOGNzGpiqGIniZKg/q1WNanFUWpS5pxXK5tyi+VN2TV3dtHt/tCvFjDcVZpwtwNhOH85yXD8P0JZtD/WDL5Zbj6zzKnGnTdLCVW6tOjCFGopVKig6tS/LHlgpS9gr5wuf2SP2db/466p+0lq/wo8H678Y9S0nwppUXjHX9F07Wr7Qj4Oub650vVfDD6lbXL+G9cuTdWcOrato72l1qcGgeHkuXZtJgc/R9FfslHEYjD+09hWq0fbUnRq+yqTp+0oylGUqU3BrmpycIuUHeMnFXWh/mbKEJ8vPCM+WSlHmipcsldKSunZq7s1qj8vfh9H/AMKB/wCCnvxe+H0QFl4D/bU+D+k/Hrw3ZIBFp9t8aPgxJpnw++J6WNumI1u/FvgrU/BfiTVnVEMuoaJd300k11qkpH6hV+ZH7dqDwp+0X/wTS+LduNl1ov7VOqfCDUJQArP4b+PHww8UeGZ7PeAGCS+K9G8GXBQnY/2TlSwQr+m2R7/kf8K9fOf32HyTHu3Pi8qhRrO926uW4ivlsZSfWUsJhsLJu2rerlLmZx4P3J4ygvhpYmUoLoo14Qr2S6JTqT6v5Kx+af8AwT8nEXxQ/wCCkOj3DN/aVr+3b4w1aWNyC66brnwp+E76RJnr5csVjceUCOEQc5NfpbX5d/s7zf8ACvP+CmH7evwuuj9ntvi34E/Z7/aX8KQMfluoIfD9/wDCLx1JbHOCbHxB4X0i41AYDI2u2BYlJEx+j+g+MvCXim71ux8NeJtA8QXfhnUn0fxFbaNrFhqdxoWrxoJJNL1eCynmk06/RGDPaXiwzqpyYxijiSSeaRqtpLF5flGJoptXlCplODlourg+aM0r8soyTd0zXLKFaWDqyhSqTp4SrWjiKkKc5Qo3xVSnB1ppONNVJtRg5uKlKSjHVpHSn2/z+h/lX84P/BfjxoYIP2efA6zMqz3fjLxPNDuwri1g0rTYnZf4tpunCE8AlsAHmv6Pee35/j7g+/8Ak5r+V/8A4ODhc23xV/Zyu23C0n8F+NrVWJGwXEWr6PIy/wB3c0cqE9MhevHP5Z4h1JU+Es0cHbmeEhK38k8ZQjJPycX/AErn9f8A0G8Dh8w+k14eUsRGMo0Y8SYukpJNfWMNwxm9Wi1faSmk0901prqfy/8AjO7a61/UZSc7ZXUE4JAXIxwSOMdOxyK+i/8AgmN4DHxI/bg8ALcWq3Vl4Te68UTLIpeNJdPj22pYZ43SOAC3y7tpIJ218weIc/2nqZI6zTn8CWI/+tX6b/8ABCnSItU/a98aTSqC9l4MtTErcnE+sRRP2PBXr0OOM9a/nngzDwxPE+V0qmq+txqNO1r0r1Fp1d4+ny3/ANu/pZ5ziOHvo9ce4rBylTqvhypgoyi2nGGOnQwNWzTT/hV5rSzs3fqj77/ar/4Jhftl/Fj42eNfifpfxM8G2+j+MtWFxoWjLFqrNpehRpHbaZYy7rZog8FsiK6oSm7cQcYr8LPHn/CZ+AdR8X+GdV1Kw1G58MarqGgXGp2URSC6ubGeS0nkgyqNt82ORRuUEYyepNf6QHittI8MfDnXPEt/HBHD4f8AC2o6m00iriMWenSTBjlTt+aMHOc89c8V/nG/HzWf7Rs9e1+VEju/E2v6prE6qfuyajdXN64zwSA8pxk8gDmvtfEvIcsyeWDr4ONZYzMauKxGJlOvUqc6TpXtGUrR5qlW6aivh5Voj+UfoAeMniF4n0OKcn4qrZZX4X4HyvhvJeH8LhMowWAdCpOOLS5q+HpQnWdLBZfGLVScneqpy1kj7G/4IbaNf6/+2J4j8WKrM3hnwtLDFcFScTa1cNZyRq/zYZ7cyMwP8K84zX99mhqy6XZh/vmFN31wB+mMf/Xr+MP/AIN3PAjXur/FTxnNApW98SaRpdtMVBPlWVldTTIpOcL5siZwcZA9Sa/tKtU8u3gQDhY1H04/p0r9L8OMK8NwtgW1Z13VrvTV+0qOzf8A27FH+fn05eIv9YPpC8XtVHUhlf1DKaet+VYPA0FOK7JVqlV225nKxYoorzz4i/Fn4afCLTdL1j4n+OPDPgPSNa1q18OaXqnirVrPRdPu9bvYLm5tdOjvL6WG3W4mt7O6mUPIiiOCRmYBa+6nOEIuc5RhCOspTkoxS2u5NpLXTVn8i4fDYjGV6eGwlCticRWly0qGHpTrVqsrN8tOlTjKc5WTdoxbsm7aHwn/AMFKMTQfsP2ERBvbv/gof+ydNaRfxyx6V4+i1fUyhI4EOlWN7cScjMUTjvg/pfX5i/tYXUPxI/bX/wCCcnwk06aHULPQPGnxW/ab8RLbyCWKPR/hx8Ob7wp4RvZGQmOS1ufE/wAQIprWQFkN3p8DIclc/pzk+h/T/GvoM0iqeV8OU2/3k8BjMVKOvuwr5pjIUb3t8cKHtFbRxnFpu55mGu8TmErNJV6VO76yp4elz+fuylytPZp7O5+Uf7fMr/s9ftBfsg/t0W6Pb+E/BnjC9/Zt/aG1CJT5OmfBP49Xem2Ol+L9YcYWPRPAHxN03wxrGrTOQtvYX1xefO1ksUnK/s7fDrSP2Wf2uNX8MeK/GPwU8BwfFq58an4VaZpOqXH/AAsv4/aHrGt3PjRda8cRrpllprar4M1LUZdI8PalqGr6zq2qi912y0r7Bp01np7fp/8AGH4VeDvjl8K/iD8HfiDpker+CviV4R13wb4ksJAN0mma9p89hNNbSfet76zMy3mnXkRSeyvre3u7eSOeGN1/DL4X+HfEPiSHVf2a/jL4b1j4g/tvfsB6fptv8KrZfF1l4An/AGqfgFD4o0TVfhD8Qh4uvo9qafY3XhrRrT4h21tdG7tta0XUrDUTnxKC3DmmGnm+RYLHYaCqZpwo5wq0vfc62R4mv7X20Y04yqTlg8RVq0anIpSjGtgvdlShUifc8DZzQy3H5zw3mmKqYTIeNsJHCV61JYW+HzjC06v9l1Z1MbVo4ShQdep+/qYipCnHD1MXNVcNVVPFUP6FPTqMn/H6/X/OK/nF/wCDiLwTd3Hwt+BHxLtYC8HhfxprWharOFP7m18QafaNa72CkANd2IUBmGScAHt+uP7H3x81r4x+Gtc0nxV4g8O+O/GfgjV9S0fxv43+HmjXel/CyLxWb+W6u/APhHUdUvZrzxXP4FsLzTtH1jxNZQLpuo38U0jLY3hl0+Liv+CnXwGb9of9jH4xeCbK1F3r9hoLeK/DKBSz/wBt+GXXVLZY8ENulSCaIhT8wcqc5xXw/EuGWecLZnRw6cpV8FKrQi7OXtqEo14QfK5RcuelyOzkr3Sk1qfrXgDn9Twh+kR4e5rnU4UaGUcVYXAZpWXPCj/ZucQqZViMSvb06NRUHhMe8RF1aVKappSnCDul/no+JEzfzSLgfaEMinIP3xn+o/Kv0e/4Id+K7Lwt+3HcaJegb/GHhC8sbMlgoFxp9zDfjqwBLKrAD5my3ABzX5oanqcCKLa8ZoL2yeS1uIpQVdJIHZJEcHBV0ZSGUjIYEE9K9D/ZO+LkHwR/ay+CnxMW8EWnaX430i21dlfCnSdSuEsb0SHnEaxzCR/QJk45r+YuGMWsu4hyzFVPdjTxlKNRtW5Y1JKnO97tOPNdq/Rrqf8AQR9I7heXHPghx3kGClHEYrF8NY6pgYU5pyr18LRjjsKqfLe/tp4eEI9G5rpqv9Az/goV48/4V/8AsS/GPWophDc33g/+wLFywUm616e306MLllJci4YKFJPPFf583x/vxDZWVmGIEcEkhUE9SpABPJycngke/av7H/8Ags58YtGsP2NPh1o66hGtr8SfFfh29huUk/dy6dpFidbWT5T88cjm2IAIyTyDjFfxI/G/xTp+sajMbK5WaEIkEZG4bj0OMjOGJx0GQM4wRX3XirjViM8wuEhJSWGwOHSSafvVpyqt9bWi6bfy0P4+/ZxcLzyHwa4j4kxNCVKWfcV5xNVJwcG6WU4TC5bThzNWbhXji3bTlfNp1P63P+Dev4fjSf2e7DxA0beZ4l8RaxrDuynJj3/ZoCCeqlI2UEAdMDNf09AYAHp7Yr8Z/wDgjd8Px4M/ZW+E1m1t9nlHg7SrqddhQtLfwtes7DpuZLhM5yT17mv2Zzxk8f598V+38N4b6pkeW0GrOng8Omv7ypR5v/Jm/O+77f5D+N2eviTxW48znndSON4nzirTk2pXpfXa0KNmm017KMEvJbCE4BPoD/Kvw/8A2sPiP+0j4q/ai8J/A1fhf4M+LnwL8SeM/Bsmo+HfGXwgvfiF8LdQ8H61qZ8O+J2X4swaPbab4O+JHgKPw9qHiNPD2pLfXjP4su0knk0PQYdSr7g/bO/aK8K/DHw5p3wz0741J8G/i/8AEa603TvAnitPBcvxB07wrqE+s6ZZ6VqHjrRYIZ4tJ8IeItYurHwjNquoNZp5+s4sbqK5hM9v8NeMrLxl8APh3B+z/wDCfQfDvhj9vX9vDV7uXxRoXgHxb4p8TfDb4b2jfbNP+JX7RumaRrTRDwf4d03R5p9fubOyh08ap4zv7HRbe/urqG1lHo0svr8R5nh8lwdeWHjCpHEZjjYVIqjhMLRi6td4pe9alToXr1o1eSLpK8PbSU6Sw4axWH4CyavxrnGV4PMa+aYXE5ZwzlGZYPExqYitWlGk87wOKk8PGEcNUU6OHxeXSxmIpYmEqdb+znXweLqfQP7HpX4+/tZftVftfQIk/wAPtB/sj9kj4AXa4e1uvDHwvv5dS+MfiXSJYybefT/EnxSeHQ0uLfcoHgJbUsssNyp/UWvJvgT8GfB37PXwf+HvwV8A2zW3hP4deGrHw9phlC/ar6SANNqes6i68Tarr2rT32t6tcHLXOp6hd3DlmkJPrNfQZ1jaWOzCrUw0ZQwVCFHBZfTlpKOAwVKGGwrmtEqtSlTVbENJc2IqVZ294/KcLSnSopVXzVqkpVq8t+avWk6lVpu7aU5OMf7kYroFfCX7af7IWp/Hy18GfFr4MeKofhR+1v8Cbi91v4F/FYwvJpzteosev8Aw2+ItpbJ9q8RfDDxzYrLpevaP5iyWM08Os2Gbi2kt7v7torlwONxGXYqni8LNRq03JWlFTpVac4uFWjWpSThVoVqblSrUZpwqU5yjJNMutRp16cqVVNxlbVPllGSacZxkrOM4ySlGSs00mj8dv2QvFvws/aK+N1xrnxAj+If7PX7Y37Pmif8I98Qv2TY/E9v4c8D+FHu9Sm1DxP8RfAfh3SbO1tfiH4A+Kl7fWN3P4smu9atZ47bSopY9L1bzLq++t/h3+1hoHxe+LPxU8FaRp2mD4PfDuW38F3fxa1LVdOtPD/ib4nXkOnzX/gLRFvr21nv7/RrW+lj1QWtheWgugtn9ujvElszJ+1j+xL8Mv2pY/DniyfU/EHwq+PPw3ke++EX7Qnw3uho/wASPh/qIExS2F2mLbxN4SvJZ5DrXgzxFHe6HqcUkhMFvd+VdxfkX+0bZ/Ffwd4csvh7/wAFEvhNr914a0HWdd1zwz+35+yH8PLfxZ4Ol1jxB4YuvBd/4w/aE+Bp0LVrnwX4jOgXluq+J4dN1rR9O1q1gufD2q6TJZWctz14vJaeaxeL4Thh6WMlUlicZwzWqxpV8RWcVFwyrE124YzDS+KGGbWYU+Snh1GtShLEz+ryLP8AL8RiVgvEDE5hUwqweGyrKeJaUJ4qHDuFp4mNeWKq5bh3RqVq6tKkp+1lQgsVjMZKhiMXKlBeG/tGf8EGfhF8R/H3ib4nfDb4o+MLfw74/wBav/FFnYeHI/DOp+HrQaxdy3csWiX0EDrcaf50kht3EsqhSU3EKCPnBf8Ag3r0RrmGT/haXxNUxOrKy6Z4fyrKQQyt9mADKwyMcZ7g9P2Q+BHxF+KY1O51z9k/4i/A79oD9jz4f/B3xLp/w1+G/wAKfE+i+IfFct/4P8F+G7D4ceEte0q8W28V+HviBqniiTW7rxXcXGqtpr6ZDbxahpdt4ivfNT6Kuv2vviN8OfGXwR+F/wAYf2er4eNPifpXhS98Q674J1LyfAvh3UPFfiKx0BdB0jUfFkGmjxL4g8MLfDVPF+hWd/Hqdlp8DzaLb68ZbdJfyyvwlw5Qr1o5pw7Uy3FxrSjXp4nCYiH76dSMXKDV2o1KknKHNGnJRi3KMFq/6opePn0h44TCYLhbxhlxNlVPLKVXB08LnWVrG4bLsPg5VvquPwuPo0KkcXgMHSpxxsac8TS9tUhRo4jETk0vif47f8Eurn9pf4CfBD4beP8A4y/EyA/AzwzJ4f0maystCeXxGzRW8Fvqutpc2cgGoW1nbJZobVoojDksrOSa/MG7/wCDerQLjUI5W+J3xKmiiuo5Akmm+HwJVSVXKufs2QGUYYgcA+or+hfRP+Cgng7xnBbP4U+H3i7STZftL+A/2f8AX4vEWk2GoGSLxo+tLbeJNMuNB8SvYRadLFpK3aXz3moSWlpcW8tzo8xuY1TE/a8+On7WPwz+PHw48D/AT4MzfEDwVq3hrTvGGv3tp4J8T65/ak+l+PdB0zxJ4CHivT7aXwv4N1rW/B99qN14b1TxTeaVpVrd2kt7f3jW1sbW50xeR8J4vmzGpl8cbUi8PRlUp0q1aq7JUaNoqXvKKpqLstLWet0/J4Z8VvpI8Oxo8DYLjXEcKYGrDO8zoZdj8xyjLcupuc/7TzSXtfZSpQq4qeO+swTmlUVZODjCN4/S37Kvwu/4VF8M9A8LTkxQaBo2m6VFNNsjJttLsYrOOSUhUjUmOFWcjCg54Aryr4i/t9/C7R/jLrX7LXh+9vNH+PV7Z3Fp4NHizR5Lfwpq+sar4bs9X8G3Gl3aXsJ16y8S31+dN0vyJ7GGa60XxAbu7srXTlmuvnP44W3xtu9V+Plr+1l8evhV8Df2P/EnhbWNF8M6dr3jbRvCviy21CPVvD/iDwZr+l6n4Xg8O+JJIke21Pw54r0C98YSza1F5dtY2OoWt/KteL/s/wDjT4teOfCfg7wX+w18K28XeJfD3geb4a6t/wAFE/2hvBes+DvAkPgk+Ib3WIdJ+Fui6zBN40+LlpoNzcQP4fsbP7J4MFxp0EN9qVoplFt9tl2TZ9m0IPB4T+xsnoS5MTnObpYbCRp0pypTpUZucW6lSmo1sNKi8RiaiTjHCOXLf8Rxb4KyH67mfEWc0OM+I8dRp4jAZFw1iKv1fC43H4PD5hh8bmeYYnBuli44HFfWMtznJ4UMPFVZU6lDNKlPnitu58WeJ/gFafD74k/tW+GNL+OP/BQfxVf+MNA/Zg+DngpNPb4n3Ph7xUtjO/g/4lX3g/Uv+EM1rwl4Q1OGfW5vFd9bDw34P01ZbixvptRguL+vvb9kT9lvxP8AC/UfGPx6+P8A4isfiH+1f8Z4bKT4heKLGNj4a+H3hm223GjfBj4Vx3ES3Vh4B8LTtJLNczk6j4p1x7jWtSZIRpenab0P7Mf7Gngf9nfUPEXxD1jxD4h+Mn7Q3xBgt0+Jvx9+IcqXnjDxGsDNJFomgWMR/snwJ4KspHI0/wAJeF7ezsdscM+qS6pqCG9b7Er25VsvyjL5ZJkMqtalWUP7VzrER5cbnE6fI400nedHAQnTjNQnL6xi5wp1sV7NQoYXDfBZ5nWZ8VZtPOs4jhcM06iy3Jsupuhk+R4apVqVlhMtwilKnh6MJ1qrhSp+5TdSo4udSdWtUKKKK8c4gooooAKZJHHLG8UqJJFIjRyRyKHR0cFWR1YFWVlJDKQQQSCMUUUbbAfAPxe/4Jg/sZfF7xHceOm+Fn/CqviZcMZpPih8BNf1r4K+Op7ou0ovdS1TwBd6Na65exytvju9fsNVuIyFEciKAK8pj/YF/au8ElY/g3/wVF/aO03Tosi30j47eBvht+0LbQIpzFENY1S18F+MJ1QEq733ie8lkTaPMXYpBRXu0eI86pU4YeWOliqEOWMKGYUcNmdGEVtGFPMaOKhGK6KMUl0SOGpgMI3KaoqnNu7lRlOhJt2TbdGVNtvq99+7J4f2b/8AgqBEBY/8N+/Af7IJjMb8fsVWC6lJLhk/tF4E+McdqNSYHzHdZNpkJ/eYq1/wwx+1r4wYp8Xf+Cnfx7vbFv8AW6Z8Dfht8MvgRFKrcSRtq0cHj7xRCjIWVTZa/aSxHa6S7lBoor0cVn+YYdU3h6eU4aTXN7TDcP5Dh6qa5VeNWjlsKsHZvWE1uzGOFpVGvazxNVJpWq43GVY67+7UryjrZX01tqekfDT/AIJlfsh/D7xBa+Nte8Ban8cfiNaSi5t/iL+0V4p1341+KLS8x817pS+OLvU9C0G9dtzNeaDoumXTbiHnZQoH31DDFbxRwQRRwQQosUMMKLFFFGihUjjjQKiIigKqKAqqAAABRRXz2NzHH5lUVXH43E4ycU4weIrVKqpxbvy04zk404315acYxXRHfSoUaEeWjSp0o9VCKjfzk0ryfm22SUUUVxGoUUUUAf/Z"/>
									<h1 align="center" style="padding:0px">
										<span style="font-weight:bold; ">
											<xsl:text>e-Arşiv Fatura</xsl:text>
										</span>
									</h1>
									<img alt="" width="100px" src=" data:image/jpeg;base64,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AEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBywAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQASwAAAABAAIBLAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADXQAAAAYAAAAAAAAAAAAAAKsAAAF/AAAAFAB5ATEAbABkATEAegAgAGkAbQB6AGEAIABzAGkAcgBrAPwAIAD2AG4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAX8AAACrAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9u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bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4NCgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iQzJCNzA2QzgwRDVDMEJBNjQ1NjIyN0M4Q0RGRjIxRjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzg5N0Q2NUFCNEFCRTUxMTk4NkRBOUYxQTg5QjE5NUYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iQzJCNzA2QzgwRDVDMEJBNjQ1NjIyN0M4Q0RGRjIxRjQiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wOkNyZWF0ZURhdGU9IjIwMTUtMTItMjZUMTE6MzQ6NTcrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE1LTEyLTI2VDExOjM4OjAxKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE1LTEyLTI2VDExOjM4OjAxKzAyOjAwIj4NCgkJCTx4bXBNTTpIaXN0b3J5Pg0KCQkJCTxyZGY6U2VxPg0KCQkJCQk8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Nzc5N0Q2NUFCNEFCRTUxMTk4NkRBOUYxQTg5QjE5NUYiIHN0RXZ0OndoZW49IjIwMTUtMTItMjZUMTE6Mzg6MDErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+DQoJCQkJCTxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODk3RDY1QUI0QUJFNTExOTg2REE5RjFBODlCMTk1RiIgc3RFdnQ6d2hlbj0iMjAxNS0xMi0yNlQxMTozODowMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4NCgkJCQk8L3JkZjpTZXE+DQoJCQk8L3htcE1NOkhpc3Rvcnk+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCTwvcmRmOlJERj4NCjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAzAHADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKj+0L60sjsMbcc+tAD6a0ip1NQtI2cbvy7UALuZtvbqe5oAk8/crbewzTWLEcn8BSDEh7hvTNLL936c49aAIxIwz83/wBelkDJ/Ex3e/WlWUAdDjHBx1ry39r34zz/AAc+Fm3R8T+MPFl3F4d8M2ofa1xqFySiMP8AZiTfMx7LEaAOo+FfxVtfi0muXWnQTCx0fWbnRortyGj1A2+xJpYyP4Fm82L3aFu1dYEw69x/KvJ/A/ibw78A9X8B/CHTlmu9Um06aUmADbbxxJvluZz2M0pbHUszk+pr0fxJ4q0/wT4cvtW1a8t9O03TYXuru5ncJHbxKCWdj6ACgDSO5Tlf1pfPbH3a4b4ufHTQ/hN8LG8W30k11ZzRxDT7W3j3XOrTzYEFvbocFpZWZVUcYzk4AJGvd/EXTdG1jRNL1K5isdZ8QB/sdgzeZNIyJvkA25GEGQW+7nHPIoA6SI7owfXmnZryrxh8R9Y8QfHTRfBfhW4gX+y9uq+K7kp5gsrUj9xa4PAluG3EHqqRse4r1ONPLQCgCHBbAC/ie5pNy7MLv9jUywhWzksfemXC7Tn+8Mf/AFqAI85Lfd29/enNJkcdOlN3ZA2r93gYHSuK+Iv7Sfw/+EKs3irxx4R8PsvGy/1aGGRu2AhbcfwFAHbg+WeOQP1rnPiL47bwna28Fnbf2jrmqFotNsQcee4A3O5/hijyC7ngDAGWZQfIL7/gpf8ADG602VvC7+KvHl2sghhtvD/hy+uTcOem2UxCPb6tuwKyfC/7TPiq68V6pr0PwL+J0kl7bqHlv5bKyitIo9u2JTcSxhI8GSRyM5cgc4+UA2P2d9P1q2/al+KTah4k1bXI9JsNH067W5uG+yJqDpNdyG3hzshiWGe3QKoBOMsWYlj59Z/EuH4wftb+I/iXcW8moeFPgzajw34Ssw+Dqev36qJZIx08xoZIYVPVUuCcDJrziL9o34neD/gL4g1W3+H+l6bdeP8AUZvEl3d3viZWvL5b27S202xiihicrLcxLbW6HdhVWV/lwDTfBPhL4sfBL4CX3iWXU/h1Y6b8NpLya2ZNOvNSfX/EFxKy3NwN0kIZhcTfY4idyjEhUbRGaAPfv2RvDM3ib4w+PvFmoSLeXml3X/CNS3oJP27UFEcuoMhI/wCPeKQwWcS8bfscxx8+TX+I11b/ALX/AMcrXwPNtuPAWgsmsalAJAU1pIZiEaZeQ1o88ckSo3EvkTt9xVLedW3wX8cfAT4DDQdS+N2uaNpPh3S7jVvGFxo/h/ToxatMWurtFlmSWQ3M8kr7cMCPM3c/KD5R4w/Z41rwn+z9o+n/APCXfFD/AIWz8YpoIJrb/hLbiys9HW7/AHVnbSJaeUpW3tFA2DjEE7ADIoA+jvB/xatf2g/iz4i+I0kZ1L4a/DO4bSPDEaRg/wBs6ypKT3EQPDbGZYUkztUhuQVfHNxfG7Tfhp8KdW/aA8QLbax458WRjRvBmny3ixpcxzz+XY29urlRFFNL87ScZiUyMeSB5H+0f+yB8K/hp8C/C+h29ncaT4Rmv7fwvDrWp+IL2QQWKo0mq6oomuGjhUW8dwsW0cSTPIBllr1f9nv9m34d/Fn9qG+1rTfhj4Q8O+B/hxpNvYeHrBdCt4G1K4vYMm9nTyw3FmI0jST5lWdyQC3AB6R+zD418A/AXwB9l1/4meCdc8b69O2r+KdVg1OJv7S1KUDzCg3ErDGoWKJeNscaDA5r2bwd8YPDPxB1GS10XWLPUriFPMkSBi2xc4yeMda0NO8EaRpMKR22l6bbLGoVVhtUjVQOMAAdK0UgWM8flQBxPxDvfiLJqslv4VtfB0No0Y8u81We4kdX75gjUZHXH7wV59qn7P8A8aPGUjHU/j5feGopcbofCHhDTbdox3VZNQW9OT/eKceneveVi2tu6/0p1AHzef8Agmb4G8UBm8beKPi58SGZy7R+JPHmptZux6k2VrLBafh5OB2Ar0L4cfshfCr4Rgjwv8NfAugszeYXsdDtoZGb1LBMk+5NemNArE5HX3oSFUbI/nQBBBGsSiONfLRRwqjaB+VeOftseOZ9J+FkfhbS1uJ/EHxCuhoNhBbjMzxMu+6Yem23WT5uxZTXtMwO3cP4f5V5HpPgjXPFH7RXiDxnqViVsfC+nNonhSzn2qZZZMSXd3nsJWWGFSTwsTEY3nIB4ZD4AvvHX7Stj4P0TyY2+HdsmpaxdKVa3ttYubdYLbahzlNP09mWFBgGWeJjysjH1n9qz9nXxB8SPgJ4f8F/D+40vRDp2v6RdtPfIZY7a2s7lLnzApz5siyRRvtfIcghsgmrf7FXwB1b4T+Ar7VvGAjl+IPjS+m1jxFMjq6pLI7FLdSoC7I1IUY/M4Br24DaKAPmD9pr4J6xpfwo8E+D9F0vXPGGm3XiOPU/FG1kW68SSQg3AW6k4SNLi6WEyMAESNNqgKFSm+N/2OvG/jv4neD9Vk8TQ21vZw3l3rF0T5s6Xl40cdwLZcBVKWaNbQOR+6WR3wznJ+ocUUAcD45/Zo8E/E238Kw694b0vUrfwTdpfaLbzKxhsJkTYjhAQr7VxgOGAIBxkA0zwd4MuPBnxr8bXzSbrPxULDU41CAYnih+yzc9T8kVufTngdc9/IW2/L1psluk7KzL8y9D6UASA5FQz8v+X86mphi3Sbj+AoAfRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z"/>
								</td>
								<td width="33%" align="center" valign="top" colspan="2" style="padding-top:10px">
									<table border="0" height="13" id="despatchTable" style="border: 1px solid black; margin-right: -2px;">
										<tbody>
											<xsl:if test="n1:Invoice/cbc:CustomizationID !=''">
												<tr style="height:13px; ">
													<td style="width:105px; padding:4px;background-color: #DAA520; color: white; " align="left">
														<span style="font-weight:bold; ">
															<xsl:text>Özelleştirme No</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding:4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #DAA520; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Senaryo</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #DAA520; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tipi</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #DAA520;color:white ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura No</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #DAA520; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tarihi</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #DAA520; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Zamanı</xsl:text>
														</span>
													</td>
													<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:if test="n1:Invoice/cbc:IssueTime != ''"><xsl:value-of select="n1:Invoice/cbc:IssueTime"/></xsl:if>
										
													</td>
												</tr>
												<xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
													<xsl:if test="cbc:ID !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px;background-color: #DAA520; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye No :</xsl:text>
																</span>
															</td>
															<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
																<span>:</span>
															</td>
															<td align="left" style="padding: 4px">
																<xsl:value-of select="cbc:ID"/>
															</td>
														</tr>
													</xsl:if>
													<xsl:if test="cbc:IssueDate !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px; background-color: #DAA520; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye Tarihi :</xsl:text>
																</span>
															</td>
															<td style="background-color: #DAA520;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
					<table id="lineTable" width="793" style="border:0px; border-color: gray;">
						<tbody>
							<tr id="lineTableTr">
								<td id="lineTableTd" style="background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>No</xsl:text>
									</span>
								</td>
								<!--<td id="lineTableTd" style="width:144px; background-color: #DAA520; color: white;border-right-width:0px;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Kodu</xsl:text>
									</span>
								</td>-->
								<td id="lineTableTd" style="width:294px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet</xsl:text>
									</span>
								</td>
								<!--<td id="lineTableTd" style="width:114px; background-color: #DAA520; color: white;border-right-width:0px;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Açıklama</xsl:text>
									</span>
								</td>-->
								<td id="lineTableTd" style="background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Miktar</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Birim</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:74px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Fiyat</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:74px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:100px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:84px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Tutarı</xsl:text>
									</span>
								</td>
										<td id="lineTableTd" style="background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Diğer Vergiler</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:84px; background-color: #DAA520; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet Tutarı</xsl:text>
									</span>
								</td>
							</tr>
							<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
								<xsl:choose>
									<xsl:when test=".">
										<xsl:apply-templates select="."/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
							<tr>
								<td colspan="3" style="text-align:right;">
									<b>Toplam Miktar :&#xA0;</b>
								</td>
								<td style="border:1px solid gray; " colspan="4">
									<xsl:text>&#xA0;</xsl:text>
									<xsl:for-each select="//cbc:InvoicedQuantity[generate-id(.)=generate-id(key('unitcode', @unitCode)[1])]">
										<xsl:variable name="uCode">
											<xsl:value-of select="@unitCode"/>
										</xsl:variable>
										<xsl:variable name="lstInvoiceQ" select="//cbc:InvoicedQuantity[@unitCode=$uCode]"/>
										<xsl:call-template name="ShowEmployeesInTeam">
											<xsl:with-param name="lstInvoiceQ" select="$lstInvoiceQ"/>
										</xsl:call-template>
									</xsl:for-each>
								</td>
							</tr>
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
										<td id="lineTableBudgetTd" align="right" style="background-color: #DAA520; color: white;width:68%">
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
											<td id="lineTableBudgetTd" align="right" width="200px" style="background-color: #DAA520; color: white">
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
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
												<span style="font-weight:bold; ">
													<xsl:text>Hesaplanan KDV </xsl:text>
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
		
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #DAA520; color: white">
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
										<td id="lineTableBudgetTd" style=" background-color: #DAA520; color: white; width:200px" align="right">
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
								<table id="hesapBilgileri" style="border-top: 1px solid darkgray;padding:10px 0px; border-bottom:2px solid #DAA520;width:100%; margin-top:5px">
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
												Bu fatura düzenlendiği gün sevk edilmesi durumunda ayrıca sevk irsaliyesi aranmaz
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
