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
					 border-spacing:;
					    border-style:inset;
					    border-color:gray;
					    border-collapse:collapse;
					background-color:;
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
					 background-color:;
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
			background-color:red;
			color: white;
			}
					</style>
				<title>e-Arşiv Fatura</title>
			</head>
			<body style="margin-left=0.6in; margin-right=0.6in;  margin-bottom=0.79in;border-top: 2px solid #FF0000;height:auto; width:793px; margin-top:10px">
				<xsl:for-each select="$XML">
					<table cellspacing="0px" width="793" cellpadding="-20px" style="border-bottom:2px solid #FF0000; padding-top:10px;padding-bottom:10px">
						<tbody>
							<tr valign="top" style="width:450px">
								<td style="vertical-align:top;">
									<img alt="Firma Logo" style="margin-top: 5px; margin-left: 0px; margin-right: 0px;margin-bottom: -30px" src="data:image/png;base64,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"/>
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
																	<xsl:text>-&#xA0;Sermayesi :3.100.000,00 TL</xsl:text>
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
																	<td style="vertical-align:top">
																	<b>Mersis No</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
																		<xsl:if test="cbc:ID !='' and cbc:ID/@schemeID='Mersis'">
																			<xsl:value-of select="cbc:ID"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>
																<td style="vertical-align:top">
																	<b>MersisNo</b>
																	<span style="float:right; font-weight:bold">&#xA0;:&#xA0;</span>
																</td>
																<td style="vertical-align:top">
																	<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:StreetName">
																		<xsl:if test="contains(., 'Mersis No:')">
																			<xsl:value-of select="normalize-space(substring-after(.,'Mersis No:'))"/>
																		</xsl:if>
																	</xsl:for-each>
																</td>
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
								<td style="vertical-align:middle">
									<img alt="" width="100px" src="data:image/png;base64,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"/>
								</td>
							</tr>
						</tbody>
					</table>
					<table cellspacing="0px" width="763" cellpadding="0px">
						<tbody>
							<tr style="height:118px; " valign="top">
								<td width="40%" valign="top" style="padding-top:10px">
									<table id="customerPartyTable" align="left" border="0" height="50%" style="margin-bottom: 5px;border: 1px solid #FF0000; border-left-width:5px; width:95%; margin-left:-2px">
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
									<img alt="" width="100px" src="data:image/png;base64,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"/>
								</td>
								<td width="33%" align="center" valign="top" colspan="2" style="padding-top:10px">
									<table border="0" height="13" id="despatchTable" style="border: 1px solid black; margin-right: -2px;">
										<tbody>
											<xsl:if test="n1:Invoice/cbc:CustomizationID !=''">
												<tr style="height:13px; ">
													<td style="width:105px; padding:4px;background-color: #FF0000; color: white; " align="left">
														<span style="font-weight:bold; ">
															<xsl:text>Özelleştirme No</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding:4px">
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
											<xsl:if test="n1:Invoice/cbc:ProfileID !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #FF0000; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Senaryo</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
											</xsl:if>
											<xsl:if test="n1:Invoice/cbc:InvoiceTypeCode !=''">
												<tr style="height:13px; ">
													<td align="left" style="width:105px; padding: 4px; background-color: #FF0000; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tipi</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #FF0000;color:white ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura No</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #FF0000; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tarihi</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #FF0000; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Zamanı</xsl:text>
														</span>
													</td>
													<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:if test="n1:Invoice/cbc:IssueTime != ''"><xsl:value-of select="n1:Invoice/cbc:IssueTime"/></xsl:if>
										
													</td>
												</tr>
												<xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
													<xsl:if test="cbc:ID !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px;background-color: #FF0000; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye No :</xsl:text>
																</span>
															</td>
															<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
																<span>:</span>
															</td>
															<td align="left" style="padding: 4px">
																<xsl:value-of select="cbc:ID"/>
															</td>
														</tr>
													</xsl:if>
													<xsl:if test="cbc:IssueDate !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px; background-color: #FF0000; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye Tarihi :</xsl:text>
																</span>
															</td>
															<td style="background-color: #FF0000;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
								<td id="lineTableTd" style="background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>No</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:144px; background-color: #FF0000; color: white;border-right-width:0px;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Kodu</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:294px; background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:114px; background-color: #FF0000; color: white;border-right-width:0px;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Açıklama</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Miktar</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Birim</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:74px; background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Fiyat</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:74px; background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:100px; background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:84px; background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="background-color: #FF0000; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Diğer Vergiler</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:84px; background-color: #FF0000; color: white;" align="center">
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
										<td id="lineTableBudgetTd" align="right" style="background-color: #FF0000; color: white;width:68%">
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
											<td id="lineTableBudgetTd" align="right" width="200px" style="background-color: #FF0000; color: white">
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
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
												<span style="font-weight:bold; ">
													<xsl:text>Hesaplanan</xsl:text>
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
		
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
											<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
										<td id="lineTableBudgetTd" width="200px" align="right" style="background-color: #FF0000; color: white">
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
										<td id="lineTableBudgetTd" style=" background-color: #FF0000; color: white; width:200px" align="right">
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
								<table id="hesapBilgileri" style="border-top: 1px solid darkgray;padding:10px 0px; border-bottom:2px solid #FF0000;width:100%; margin-top:5px">
									<tr>
										<td style="width:100%; padding:0px">
											<fieldset style="margin:2px">
												<legend style="background-color:white">
													<b>BANKA HESAP BİLGİLERİMİZ</b>
												</legend>
												<table style="width:100%" id="bankingTable" border="1">
<table border="0" width="800px" id="bankingTable" style="font-size: 11px; font-weight: bold; margin-left:-11px">
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
		<td>GARANTİ BANKASI  TL</td>
		<td>ORTAKLAR CADDESİ (357)</td>
		<td align="left">6295545</td>
		<td>TR62 0006 2000 3570 0006 2955 45</td>
	</tr>
	<tr>
		<td>YAPIKREDİ  TL</td>
		<td>ŞİŞLİ ŞUBESİ (083)</td>
		<td align="left">92011062</td>
		<td>TR72 0006 7010 0000 0092 0110 62</td>
	</tr>
	<tr>
		<td>HALKBANK  TL</td>
		<td>ŞİŞLİ ŞUBESİ (9143)</td>
		<td align="left">10260548</td>
		<td>TR91 0001 2009 1430 0010 2605 48</td>
	</tr>
	<tr>
		<td>DENİZBANK A.Ş.</td>
		<td>TRAKYA TİCARİ MERKEZ (2530)</td>
		<td align="left">6671894-351</td>
		<td>TR76 0013 4000 0066 7189 4000 01</td>
	</tr>
	<tr>
		<td>BURGANBANK  TRY</td>
		<td>MERTER (9118)</td>
		<td align="left">20039041-351</td>
		<td>TR68 0012 5091 1200 3904 1003 51</td>
	</tr>
													<tr>
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
													</tr>
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
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cac:BuyersItemIdentification/cbc:ID"/>
				</span>
			</td>
			<td id="lineTableTd">
				<span>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Name"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:BrandName"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:ModelName"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Description"/>
					<xsl:text>&#xA0;</xsl:text>
					<xsl:value-of select="./cac:Item/cac:BuyersItemIdentification/cbc:ID"/>
				</span>
			</td>
			<td id="lineTableTd">
				<span>
					<xsl:text> </xsl:text>
					<xsl:value-of select="./cbc:Note"/>
				</span>
			</td>
			<td id="lineTableTd" align="center">
				<span>
					<xsl:value-of select="format-number(./cbc:InvoicedQuantity, '###.###,####', 'european')"/>
				</span>
			</td>
			<td align="center" id="lineTableTd">
				<span>
					<xsl:text/>
					<xsl:value-of select="format-number(./cbc:InvoicedQuantity, '###.###,##', 'european')"/>
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
						<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = true() ">+
									</xsl:if>
					<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = false() ">-
									</xsl:if>
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
			<td align="right" id="lineTableTd">
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
			</td>
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
