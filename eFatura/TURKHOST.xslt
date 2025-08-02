<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
	xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
	xmlns:ccts="urn:un:unece:uncefact:documentation:2"
	xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001"
	xmlns:clm5639="urn:un:unece:uncefact:codelist:specification:5639:1988"
	xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001"
	xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003"
	xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:link="http://www.xbrl.org/2003/linkbase"
	xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
	xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2"
	xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2"
	xmlns:xbrldi="http://xbrl.org/2006/xbrldi" xmlns:xbrli="http://www.xbrl.org/2003/instance"
	xmlns:xdt="http://www.w3.org/2005/xpath-datatypes" xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	exclude-result-prefixes="cac cbc ccts clm54217 clm5639 clm66411 clmIANAMIMEMediaType fn link n1 qdt udt xbrldi xbrli xdt xlink xs xsd xsi">
	<xsl:character-map name="a"> 
		<xsl:output-character character="&#133;" string=""/> 
		<xsl:output-character character="&#158;" string=""/> 
	</xsl:character-map> 
	<xsl:decimal-format name="european" decimal-separator="," grouping-separator="." NaN=""/>
	<xsl:output version="4.0" method="html" indent="no" encoding="UTF-8"
		doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
		doctype-system="http://www.w3.org/TR/html4/loose.dtd" use-character-maps="a"/>
	<xsl:param name="SV_OutputFormat" select="'HTML'"/>
	<xsl:variable name="XML" select="/"/>
	
	
	<xsl:template match="/">
		<html>
			<head>
				<title/>
				<style type="text/css">
					body {
					    background-color: #FFFFFF;
					    font-family: 'Tahoma', "Times New Roman", Times, serif;
					    font-size: 11px;
					    color: #666666;
					}
					h1, h2 {
					    padding-bottom: 3px;
					    padding-top: 3px;
					    margin-bottom: 5px;
					    text-transform: uppercase;
					    font-family: Arial, Helvetica, sans-serif;
					}
					h1 {
					    font-size: 1.4em;
					    text-transform:none;
					}
					h2 {
					    font-size: 1em;
					    color: brown;
					}
					h3 {
					    font-size: 1em;
					    color: #333333;
					    text-align: justify;
					    margin: 0;
					    padding: 0;
					}
					h4 {
					    font-size: 1.1em;
					    font-style: bold;
					    font-family: Arial, Helvetica, sans-serif;
					    color: #000000;
					    margin: 0;
					    padding: 0;
					}
					hr {
					    height:2px;
					    color: #000000;
					    background-color: #000000;
					    border-bottom: 1px solid #000000;
					}
					p, ul, ol {
					    margin-top: 1.5em;
					}
					ul, ol {
					    margin-left: 3em;
					}
					blockquote {
					    margin-left: 3em;
					    margin-right: 3em;
					    font-style: italic;
					}
					a {
					    text-decoration: none;
					    color: #70A300;
					}
					a:hover {
					    border: none;
					    color: #70A300;
					}
					#despatchTable {
					    border-collapse:collapse;
					    font-size:11px;
					    float:right;
					    border-color:gray;
					}
					#ettnTable {
					    border-collapse:collapse;
					    font-size:11px;
					    border-color:gray;
					}
					#customerPartyTable {
					    border-width: 0px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#customerIDTable {
					    border-width: 2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#customerIDTableTd {
					    border-width: 2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#lineTable {
					    border-width:2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: black;
					    border-collapse: collapse;
					    background-color:;
					}
					#lineTableTd {
					    border-width: 1px;
					    padding: 1px;
					    border-style: inset;
					    border-color: black;
					    background-color: white;
					}
					#lineTableTr {
					    border-width: 1px;
					    padding: 0px;
					    border-style: inset;
					    border-color: black;
					    background-color: white;
					    -moz-border-radius:;
					}
					#lineTableDummyTd {
					    border-width: 1px;
					    border-color:white;
					    padding: 1px;
					    border-style: inset;
					    border-color: black;
					    background-color: white;
					}
					#lineTableBudgetTd {
					    border-width: 2px;
					    border-spacing:0px;
					    padding: 1px;
					    border-style: inset;
					    border-color: black;
					    background-color: white;
					    -moz-border-radius:;
					}
					#notesTable {
					    border-width: 2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: black;
					    border-collapse: collapse;
					    background-color:
					}
					#notesTableTd {
					    border-width: 0px;
					    border-spacing:;
					    border-style: inset;
					    border-color: black;
					    border-collapse: collapse;
					    background-color:
					}
					table {
					    border-spacing:0px;
					}
					#budgetContainerTable {
					    border-width: 0px;
					    border-spacing: 0px;
					    border-style: inset;
					    border-color: black;
					    border-collapse: collapse;
					    background-color:;
					}
					td {
					    border-color:gray;
					}</style>
				<title>e-Fatura</title>
			</head>
			<body style="margin-left=0.6in; margin-right=0.6in;  margin-bottom=0.79in;border-top: 2px solid #199BDC;height:auto; width:793px; margin-top:10px">
				<xsl:for-each select="$XML">
					<table cellspacing="0px" width="793" cellpadding="-20px" style="border-bottom:2px solid #199BDC; padding-top:10px;padding-bottom:10px">
						<tbody>
							<tr valign="top" style="width:450px">
								<td style="vertical-align:top;">
									<img alt="Firma Logo" style="margin-top: 45px; margin-left: 75px; margin-right: 120px;margin-bottom: -30px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO8AAAAuCAYAAADAxE6oAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2NzYyQzA2MEUwMTFFNzkwQTI5NjU3MEE0MUE3QjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ2NzYyQzE2MEUwMTFFNzkwQTI5NjU3MEE0MUE3QjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDY3NjJCRTYwRTAxMUU3OTBBMjk2NTcwQTQxQTdCNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDY3NjJCRjYwRTAxMUU3OTBBMjk2NTcwQTQxQTdCNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpI/YYkAAEaJSURBVHja7L0HeBzV1T5+pmzfVe+W5d57wdgGTO8lwdSEhJZA8iWQhJBCAgmhh4+EQCAQQgs1FBPTTDEGV4yNe+/qfSWttu9O/Z9z5640kiVbMuT7P7/nyZAbS6vZmTv3nvec95R7RzBNE/57/Pf47/H/3iH8F7z/Pf57/Be8/z3+e/z3+P8DvGt213X+H95XBNNUDUP4QAfHPaYg7u/+k4F/VKhrXX3EXhaAYMzAP0nsBPq+CB3YduDPCdAk6zxRn4V/zeNflsCENOjsnCC2o2spQbAaO9ns+gr9LODngoD3MQX8DS8tyAO6JJ5TIJnKraIIP8RLiPxLSUMXntAE56P4c2RAE2VoIIgqmIZpdVEYyK2F0yRBfEgQYTLdk8aNbm4Y5numAb/BH2uPPlPGAAVJvFOShB/hj27+jKJhmmlDh7vx5+ewxem8wuISuG7hmbBh7ar/JwHz4JMvwClnnguJRKJLSpiI0m84qEezhaKI5zoEMHTDkmTgcylbQi3o4oD6sWDSUPqKdYwbkp/9f6YxSIDwKTtj6TObOhMbVU0/iOAwMvgBsYdk+vGRFjoE+fvYW8UmGFEN9Ad1xfxMtJ53lEOQfivKQlG3YgIBz1mjGfoD+Hvo6NgV+TQc7dCZgjFNkYBwpBMdoiAcn5flvrQ415uTubZuGFktofgV7bH0Gvx1+dHHS+xGqwBMQAQ4MoBRKYuyKJ5ZmuufmRdw4z1NJykgHGto7IjNbO2Mj5YlsfZoukwWBzIeUO5yyguHF2YXIIBF67sCJFJKoLKlc56iGq/jrwy8Ct7fGDjby9zc7PUz9PO72etfgSt7oQ9N2/v7/5eHA1suNhfvn4atjQnWII4u8BZme/9Pe08jpptmXktndLxhqC4U8qRlLBh67SM8zud13zGmLK9cQpSSrsNzoTOe0qtbOjp00LcYhh5CefjxqOK8C3P8HpkuIeE3U7oOBxrby2MJ/cWBgHfQKkggFGmkifp7RuyLOMzncowqyvZ1cwvTFCJJZYQZiQ+n3yVJhnPmjIN0KtXndZ5961MYO2EKaLpqA+eRAYx/9guiWJHlc0FewNP1uaoZ0B5NeTRdz/EHAvDZh+/AH265sW9EDhsB736+FcKhjqMNRr4sSxWFOV5RsoE96kDxau0s0k3dUVBYAtdccDLs2b65P5DaASr0AmUGhJnfMwzG6Ae0Iv+baRM3sYva2WzI/zWYUX4rZJBudzsc56KcJrkec6iGvgXH6Xr8OTxo8JJGHAzy+lRjwsC+TuBDggEqmgGny62UVAwzP3r7LfjJNZfC1Flz4MX3l0Nba0vmdDfq8hyXQ0IhJ7aNpBW/78SfBVMIYHOZAutNoQM/o/MYePH/TJU6aqpZOblyUWkunD1rOuzdua3PPt3xwF/hm9+6BqLhzkGNA9EgUZJA1w6nTNZwCKqq6+mUornpXDpHMwyiTWmv16daFKgcNE0bvCAQtWBKpE80UIcUAitaXQS+AWhp2TzLDocxcsxY/f03XuoXuHTU11TBecdPgiXrdkKkM3RkKmIY+Ix4bcnqjEOWIK2qEMjKUcsLss1vzJ/dH3ChF0j7s5Ki7XOdf+bgANR72QU74MVeQJVsILafZ/6nQUxzj1J7Qq7XfXFFQXahLItM7+s4Nw0dEV9zKHYJTtFzA/c9+ZHGSdbQnztaS+smKGjRSADtjYSCrqHiMAzkOngq+HNy9Pra6vQF86cx4NKxfdOXcNU5J0FBYXFmZNFQmRrdk+5h3QfvjyMRyMnVf/3j64zTp42EhtpqzUDLrNrPU3UoKC4x13y21JgxpKhf4H5droAg9M0wCGT2sSKqLckybNu0HuaPKzkm4HZfv38HmJSabvacI5/bAe3tzXD9wrPhtv+5+mtlUr3lIS/LC2uXL4Xjh5fA7m2boB9AijZZzADJ6OPvfQFMswE0Y4yEXlY5cw2Jt4xVlvug5FIflnjgMyFJzPXqCpcc3igO4xTIfkmk+HmTGKglXdW9naEQ7Ni8EU6eXNHVLjpxGrjcbgSC3tV6WN71e2orgy1NThQ0d6+HsGt6Mys71z2ivMRTlp8lkCUh/8WNWjaS1mDHgVol2BZMCCbOniAIRxB00eF0ai3NjWv//co/1+/ftX00p7UUWFJ6Gze8hayj0sgEBATRBLqBqqZdiWiEfPVW7JqMoBA03Zpfg3xDHMh0OiU31tXmqKrqsAmG+R8DMM2d0fMz6pKC2lU0LMtLLZlKyzUHD4zFP1Mjc98+WJ+nm2Bm/GHzMESR1U2rZH0NFkqQnTKxBK+mKiPxjExwr/1roIOMkhu8LzLOkYQsSEmnC1EcRvLTQjxwZj8yINNtINNtc2R0h3S6QG7YQGvy7xi96LFpuy70Ok+wWe8MaM0+KPXgrDDJpmRBhyDQzzCZFKtS2JxYskCWV3I4zbqqg8b1l54zeJ/3zJmjR+E/E7HRt0f0oimZQ7v6Bz+dfvMttx5vQI5bR4tBZp8ioEU5Hli7cmnVn+7+3Yp4NBy3RR2P5rhfiG0eNgo/rrbAa2dQkELK1xaKpfxut4tpIBqftK6ZG9au9nV0tJ3E3EZJjMfSxFB1yecP4AdIZ50ABzbtENcsX3p8Ih6jvuzjgQHzP2mCRYmiid23MHAiVc0E0RbDTiaTrspD+xdwYV7JfZ3DwPviu6tg+Ohx6GIoIIiD7w4pPYs6GzaeKWShbj2f32/51wJefCjV6AYvKU/Jw7TZULwx+XKfYVvKn7c3Dbb7qnYqIQqeLB0RYZiJUAbApg2kpg3wpg2gdt9W7AVaswfd776/0YtKi73AbA7YAlNmguIzgtOacSPFYyQZKknMBN0Yg9/YpDnSxGgs6rfhRjnaPeVeQCrDRmmFcbYB6aEl00qyTNN1meipYegMvKRk6E6S7MyTZGkqxUWwOQdoN2iQGrHt6uoPAUCUWcMu7Ef0/rwhnDqrcce+0i0bvih0OV1lTU11yvtvvhJuqq89mb73wdtvvD58zPh9bpdn9guvPJOjaWoFfjd3+cfvN2z6YvUcVDROm4Xrcdz157/DeRdfMTh/dyDeW0ZCcHKIRpLly0gYTpaUSiVK8Mdh2AKDp2mHceQ+ra+Gc6ToGrPAdIZTY/PlwJ+HcCW9vt8Q8sADVkwAybWROOFiVt7qCgkkMas9XMagF5nsK0iVAZyGn3hBln2Ihig3Z04uX0I/IM3QaQf/NwNMqReVNnqBHnoFwvqLYg9SFKzbmWBX5tZY0ZiZlrmGOCrzqoP7CDtnciNTRc+ZX1AEH67bC/FE5DAJkXvdS+HUpq0f8Oqy7MhCK2+Qf2ugQJp8hHgclBSuxnKvALFe0bwjgbeDa2SjKyBm4Lyh4AmiFBFFcXEkHFr8h1tvkvds3zAfz/gONqJi2fwa2f965skDN9921/JTp1SYsWgkBz8jh+5UbAXYSrFV8wkVXnp/JZxw6gJIJnQWbAoFgwy4gih+bQaYuRSGNWU4Twy89tknwywKom7z2w47Xv3wCxhSMQI0VT0GBWLllDScp5Sqs75QhtqhsY8pqK/3oqc9jhGjx8LiVZsg1N42YNOLvAc0G3id7F5GRiaMPtxkoVf8JQOujOzpYt6QGY5R805Qq7e8o9dtOcDB29tX7gaiw50WskvBbKtyc/nWbM8p9ANKOwVnbWN1A3yw+B2YPnu+iUYB3nzxafOEU86AQHYOxOMxy7cdTL6LDC9/OuZGIW3WRMuHEmUB0qm0E91WMpwUqSVTXVtUWqa+//lOiEei9gRMn+ClB6zB9gm2jf3QZrWsvOI80SEPSymqE7lh19OrXb4D6+JBbkk7oc/bHmajsHdwiAA8/bj58PrSz1mkk+iHaaj4cC7w+XKB++OF2LKweXpNomv+6KKuzBe2HD6hKp9AoqWtD/zteW36cfNwsL5W5uzhbIVyd7X8WboeTjesIJtge2yyhF/R1h7V+hKFVSnAqGZyqyY4ydcyzSOFJGD0uInw1oovoaMtOOBbM/ZFzyh0G1KX3uMRjT4AnJm/jIW0B5Ekb/kE8Ayb7MkbWj5BLMjac7BpZ5WuqRkfVegNOHToJQTuBBQaMkK7+bw4M/G0Xm6J0MvXpqbedu+fzSkz50DpkDKfpmnj8TOv7RzgwNrLjdMg/SmKhpjt6NoZJA8s9WlS5ZFI+XchHosz41JQVBJ96KmXUrPnLYCWpnpkM/JRaTMNbD22pn4ARwOQHjF6XJnT6bkwmVZsagy1Lg+A8bmrxPYRv5480LTvzONP1F56b0VOW2srWdYzOPBIeTd6fdnPnH/Zd3fv3bGRBq3ZFmgIc7ZgD3SliT1894abikZPmDSSfE4E/jAlnZ47pGL4O+g/viPLcusR+nMBtku4ZTf4tbdgexvbAX5ONo8PnIcCO9rhcBTgswfQn6lBoDyB93spMzwGDxplRou0tmEcmZS8sXQDFJeVg94dic7hlOpcW78ELqSvc2XZK1Rqsuh7UrVSbKTlHbxIoj+NOn7yNHhj2VpoD7YOSjTpmmThGXgF694e1exBF/tQ3HovytqjwCJRj0xbTdYOOe7EsBE1Jh8wjC+4oqe/K7OPn2ucdf4F5v2/v8PJYmSBoiLPlNNP0+p21KTba3baXLcMaO2U27C5i/ojz7+hLFn0iuB0Os8WBeGb+3ZXj7/4imuGJJNxZ2d7q3nJt64REmhxNVVRJUlqRfzV46NSf97CVneEoZmJ7btEZkxToHtX4NRnMUWHxIvgLGgsYCVdcMkVQydPm3ERssHZeK+gbXzIrXyM46pf2qwfKeJ56+8foGIBRVHSpmAvJWSUiUctun2OBP93wHkQvFw2IvUmpMx3ut2urr7hYGm6kpiYirb/DH/9gmu9TNWDysEcygiC7HS03fzL36vf/Pa1Y3Lz8vJMpvDIGgtjE4nEqZ0dbdGQaS7K9I0FGKQuVeTD3653OOSLRZELPaO+xuVoQf0mSHfiaRMFwbwN+3U5NhfzbFj5JP6kC0WGpi3Ec94ReOGJxqI53cPAouWGMRhs5AmCdhXS7F9KsjTUbjQRNJdoqjYB+/lLcg3sf2O+NUXp8d4Wdk1wMQpt9Gn1p8ycjVR9lT3HPqhUEQVhuvPP+Nwar1oThN7pF6EPimz2YU0dqVSqoyPcGRuSmzPulPO/Ma1s9MQh/ryCGeV5/sIyv1uPa3rw/of/uu+LtV9s/nhnS47T5XM5052H0pbFdNoA4LBZWMGWH9ZQYQloDU/70S9+94OKESNPTqWSRfi7kErGcd51dLllSCRiVq5HZkZ/NH5E4/gNbD9F5bwWb/AIXnRDD2/XVKeh+/Sg5HKc0TUGPMSmMHkQujQXKn9h+qzjAnPmnxTA8RtF6cPOjlbweNyk/NFF1hx47k/t+JQHOjmvfbQGxoyfBNFoWFAUvLEk9oim0kemJcSmbVIGfMxbcBo899bHxPvL0FDJYPM/0W7ikBnleAeiyxEOYLvf0hV0KCwpRV82njjnkivCkiyLHR0dPVwrw9C9OI7+opJS4fqF58CXa1bAXQ8/yQJW6CuzMUFxl1nKyQYwHFB6sApBMH6Hv/4QbVcZO0XvFX8x2ak0V178IcHAS9FeU7P5wyLQ9fsjrotXbIS8gjImOHgUoYZGJiLcgt8o12zVXIIl/2EEyKdFpaVN119yFoyfOhV+9tu7oZMHmVSek8+AKo1CQ5FwsRdtnnn8fHjx3U8h2Np8TIzd4NfOCCiLqOr2bEyPMF4m8G32AnCPS+Z6PeZl04eNPS+/as5QpeOU5Pzx568+80bX/pTH0yjp0rRyJ3wnVzLiip68/OKLku/vbVaWf7lj3a6qT94O9fSH5Qwt7kXX41NnHV9432NP35mdk385ynF+KNzJqAOLWbDCGwFlW6H4hMVYMpFkS0G58JPheKXhgqHPx0d4ES/7HJrTGl4Cl42uS5FpCIcnx8A4zOtPa8jIE6ke5ERnWQuTvONigRXXDxK8ryxZCUOGDoMIBXX4COiq3h18ocIIHY5EkY54nHTa2fDkq+9Ac2M9s1HkHaq60Z0vUDXTKUsq0mCNQHb+/Ml9mq3FqzaC2+1hygTpj55Kp1nRSA+qgcPgdrp0l9vFQETHnT//H1AVxV5hZZJP0jMRaLY4RJiJ2LkM2aCvz2fF3vt8PtBTCfPuX92sr1+zHB5++lWYecIp0Nbe3sVURNFkfucAjlIE7rUI2Js1k4JuepfydlBBgGG0lA8d9qubvrvwX8uWLGaCSffMzs6FH956GwRbWpHKGl3PQcLnZM/VdW8Tx8Ck8XI4nMc8f/YIqk3ZIV1HRWFovYOTdpYn2fK6GTfIyPF59euPn3TcVcPcvy0LV5/rbGoTAklFqKxtzE8WzodYxfFQFYzCgWoDnhZJzYs+hyz4BCkfPFPmLzzrztEnzN268oWlLz31fGtTUyeIslsIlDqlIZNztN0f1vL7KWUVw503//auqz2+rO+HolGn7LD0Cek6kg1J0tmUiaJkVcAKAlOE3O/uHTcYLovwexmM0/Evv8DrrCOo4JhrVE+emW6BWVuznyCn2DV29oOWw3jdLuyMoZ8wdkjXOfJALG5ZeUVXFZAVPTUgyYomrBnRcNJUTk4GG4M55azz4fEX30JBa+rS2lTQkLZZJqSw4MKBeukfj0l/+9O9/ebdvF4/uD2eLv+OLExKtYXo0RpMHD8a/vc3t4j/eu7vQqpXLXFGukjZpXWem+XpHbcsSKh1vejXOewKgRXvI4dyyA6WW9Y1PVp1YF9bU32NCyfdoaqqrOONk0wl2cBrGH1mh1bsqCE3AX0rYyIC9ypUIjekNLPQmk/rWdwoZPm5OY3LP3zv1msuPGURVZf1UWhgWV6NLKC1EolAmk5bkWfRqkEWJk+fJfzm/odZdLm9teVYQ2hpKuBJKwaLmZks38upoSmYvRgS9KpmsgM3ObQgt/SB08b//Jve6A1K3b4sgTICDpxTpxuy2yqh4tM3QLl2NMyfVQCinmYEUFNMiMQNaOlIQG1zGGKmUZw/fcGt3y4vP+nNhx+4p8E1qshZPPRMM1T/FL9flJTW0IphE0eOGvut9mhMpiS6qnNlQ8ELv9+UBSHa0VwfVlWFHkKUJUn0ZuW4Xd6A1xBEp0J1Dhl2wReMuEQ4IeBxXS+Y4joUpt2GIHypJtMzUTkm8J4a+pxk7Dy6KTgyJErAuZBMw1TTSR3ps4mMUZMlBwXuGYczdC0eDnccevzBu3R7/vmI4F306XooLC7N0LcuCbeqdqzAh2DlLHlApu8Swf6OM8//Jjzy7GsMuPbQH1ndtGILVeJFQ7FwoLG+diZPY4V4eqnrWLp5P/kNXb4k6xf+mGIMIaMIBKTGKVBSqUkoazN4+qid+b621Lyps7prSGlWoRj72JSK0K8vSmp61zoENyoVn9uVSsXCjdU1h6LJZKKz8sC+qkUvP7ersa7m9LyCwhpVSXtVdDwVG1OhKKNw5NVIZxmC9mQ8qY9k1gsyCxEEyAl4dL9Trn7t2SceffbxP1e1B1tP4on9FA8Q1lk/02rPTMDKqq4i0IZjcZAdLnH+yafnlwypmHnCqWcJxWVD5qCSEb5C/DuBsHUmKfBhWoJM1oYpP4kyv4LZq1JJ7FVMQT8nRhXlTvjrySMeORsazgrvD4KkofcUTqKfiX89cS7kDDNgxCdLobm0AnJu+jEYigzxeBqceIfygADj8v3QWeyBDbvroaamToq7nPPmXH/L4n3b9i/a/d4z94LCOCkTscLiYt93b/jxGeFofGo0rqCeFVEJO5isF2QH9Lbaqk+rD+37+JH7fre9PdhC8ZVcj9fnO+GUMypmzztp1sSps6bklQ7N1wVJSisaq3kgOc3Kz4X2YIO/tnJ/WfnwkY2jxo6/PeDT3zu4Z/fQQ3t3idl5+VPKRo6/yHB4hiSVNJMvp9MB6VhUXbb4X3WhjrbW/ILiutz8/BaH06ki4KX6mqr6t15+flNnZ8cCnkqiOU70C963V26G3Lx8rlls2KW6ZARXKq0xC0VgJSBT3srsEZM48nHexZfDQ0++0G1xbXSLJj6BA5IJiqHuEeLtbfmNDbXncYXzaW/w9hXLJCAnFa1LYshChiMRiCcSC/A+9GAf8CIFTYDu/1g+AJ8nToX2ohWIUvjCA1aphL/nZWdpWS6pfu/mL1Yuevn5T5cvXZKP16TcczGBjykY01yFoHCjhjaSSjd4ibo7+XUywlxQWKJ+sf8QJJPmxW1t7X8NxtLliTQPanBfqyg3EDKS0fefefKpz9569Z85sUj4BzzyTEK5n1cxNXVTE4HVm9MY0PdJiaUjUapvlk675OqS0yW5JJ1KnRpKKmAmEl8pc0WKgT0jT0MxGaExs+iYvXIq0zJsgbhqbFJZ4ZTHTxr2+Ilq84JwQzv4NQmcoRie5ATttAsBfvBTEKLtMGJvFex//m+wTfLD8Mu+Bam4CAl8JqcsoCshgN8twPwRhRBQwrB1z24YkueQ77vm5OE/37g4q6omwVJSZMx8vkB2xahxs9piSTGBjIEtesFxyvJ7QdCVrff+6qbF+/bsoFTTlbxWwJVMxMVlH7yjYYsNKa/YcsEl3xpx5sJvDXdlFTjjyRQUBHwQbqn/8pF7fvP06k8/pggx/PS3d3UMHT7yg1/c+F2kbuKcCy779lk3/PLuIXFdgGRaYwE93RTBIUpCLBbVUfF3cOWWY2NRdP+5PN6zgmdY+gbv+59vB38gq9+IKPH+JFEGwxKqpKKyKp6BrhG/8LJvwx8ffxaB23zYF0hxq4zudoOXggVo3Z3IOSh/W8SjiEeseLFqRq3rZBinTMEHVSEtmccLN/y9u8x8EqTX5PPSc9HqJZMXpbL/4TWKcvxmpOHgJy+8/NzT6z9fldNYXzOfVxF5bDlISi858XsiMZWkjQHQ6h6xJ1tPTZ87X0e6dHmwremRho54aTRtPT8LkuDJFQW5bVqk/dl/PHz/umUfvjshnU7N42OR5tVLO3l+PdG1TMK0gmUEXvtSPVKMrWjRvtY0s2DFTkkYafwoIMdWqpk90j/2/GyG5semDS2Z+vgJ5Y8dl2xYkGgKQa4qw97WGFSbLhh/4aVQftFlkArHwPRkgffaG2DiPfdB+OmH4BACpvDshQg2Eyl/CBxOCWKSCT6XDMPzAtAWcEOotUmaPuPc2T/52U0/uOWWX/+ZKzrKPzjQSHhSOBbEzkRdYrXGaJBh45pP9FCo7RSuGH22UoZMmsnZUF+rPfXogwfraivVq2/61eiKoSNdm9Ysa33qT/fs2Ld7J8npJKqSevT+OxN8hNw4vwVoSLOS6RSkBBcQU2GBMLZLg5FxZdy2e/Zyfdn630CGtRwG3g/X7QKkB9Dv9jiCycBFVEHPgBcFjdFC8ysWHnC/gVE9bi1IBolmkhuFv+sDTT0JvCwxySJpVojAwRbPs0CDzifC6OHvdmW/SPA01gc9E1UXBCaMRbnZ4JeNg/9e9Oq/F7/+Eo3f2WCVGmYS+Ene6vE+zUjFvBoinpbHZeoyaCmYUzQyVTpKbn6Bed4FF/+wviH0h0PBaHEkoXYBl0A3uiy/Jd3Z+swT/3v31lXLPpqKPthxvCAkyvO8H2Nbl2EjbNg4WFXNGssBLqr/ajUi3IUVrKIDK+jYvWKRBafkCaebYu6QtIDEJ502YWxqj+OP47Vfz0g0LlCbQ+BSJPhXSxL+3ilA6WmnwqULLoC4IUNBsA2ctCy0oBRGX3MNaM88D+qzf4bm1ioInHo++L0FEOpohwSxNrTCAbcEIxDALdV7YMumra4LLzr3smef/edrO3fuOVAxfCTeXncmE0mnSooV5ZfiEBQUbu0IQ0FJ6QQ8x9XRFgxpmhbmrlolZzVxrnxIUed+sPjNipaGhiC6HoWbvlwbaWlsqMDPL+XKnBjidi4PiiRJzV6fv05yuPR4TJFoCaUooGCjHDgEM5NqjXNq3HuhisT/VsWv1w3e5duqelDXIx06s7w6o0bk0STQQlGAxxzgPhQCt3C9z84UFjDgqBy8+CkJuzjoSKhg9VPRuN1EpQNWtLC/S3UtJqWAFdJmslCGLPJ8qQEBrwdyXIK+4v1Fe99b9KqbU5lSbmVb+cBW8p9bEYBNTtlVSsaTrmVyN0M2JfA58DnTKV1Gn/CmX9x+5ZzTz7ti04HavDAClyytaa3khzEVRXWJ1roX/vrA73evX7Nymq5p07lFIKHawQVkA69mg5/dfjdcd9PPIdjcxCq7FObzqghesYuCazyg9HXCmZSNpSAMtl0QBauSaTVT7kU3T4gFw2TBE/g+2r05+Hs+ItyzcOQQ3zRt52Q12Al+RYQtYRX+HNShumIUnD1vAUhu9GHRqo7S0zAh1oFW1gB56EgYe8P1IL78Omx44xWoPbgDhJPOhPzRUyGBdDTa0QkaKke/i8yUAS+88hZce0nE+b3vXX7BLbfctaq2utIsHzaiBUx9B17uzDhaQolq6VFRN7S2QZE/L/Cj2+4ev2nNp/XrVq9YumPrpn8r6XSmYjDjo7s5tS1F0BJQp2Abw5Vqma3oKQM23el0HSwpK9vlz8qJR5qrs9KcEdFSVo+sk39m8njOl7woKGmL0Gesf2emukvunT0fSKE1CXIy3Q3eOLe8YA4UvkdW3xSkTKR1K6eG/zlkA9y6CUcqPe6LspOQphhorMi4w9BYnwH6z7EKPLpMtDmRwu+its8Q3gqfF7av+aT26UcfbI/H4wSicq4ND3AA7eATFuWAdpuCmTJMQaTxyoDXQQExhE92Tp549Q03zT3h3IVTP99d4+mMJbvSBRQ4mTN2CAQP7nz9bw/dXb1984bZ6MaM51SfLMEm7uNu533oUryGbhVimIa1eiWR0tEfNBlTohqDMcXZUFGUC+rXVCFK9+sIR2Fvc9jKX5uWwmAui2lkosxOM9qu6DVb1oMoNxuKopw7a+K8C53BG13tnbkychY1YcCykAJVDgccN3ESFOfmQyIchpbOCKiRTqjQE5CF/ddSSXBWDIcR130H4IlnIG/zdqiqPgANk6dCzvTjoGLoGIjg3KXjMchxirDjYA28/NJLzqEl+RSL+F+qWMJxCv3zb39+9zs/uePa6mC4UBSsCDyxobp0DAry812Tz7hk+MwFZ1+WCrdNMgxtDc7j52hGNg8dObIVfeREbk5hxx233Fi9YumSfVxpk/s0g9PbSh5YStoUXNTj8be4vX41Fk+DZlpsz0AiGBCZTJq8uKmRl2DG+4GmOagijZ6W12SgYOAVOW3W9Exw4iuwZiuoQrQ5zX0+alRs5Tqsjv3o5p1wmrSBV2eWt58+ZirGOHpJGdF3qUcUkCsqyEO/qzW1dvnSSCgUKuATpNis3xauNRkVHzNhEnzw+TahpaXZPNjUxtwMg4PXMNAyiZpRMXxE4LgzLhq//mCL1BlLWcLDmTwxmWAkTQmKE4OtzWUIxjxO1YKcIn/Kfd2ufNcv/vAAfPv7P2IFGtZuJVagLcXpP81RYUE+5aGVp+57sOqjD5fU+Pz+FBcYgGOYPQppT5sxO/eqm397iqqaLpbrZcErlAmkhYKVpdJZ8Us6Rm0/r6EPH5eQThvp0fKQxoGAFFqnYn3sjc/tgyFlQ5Am08YBHdDaHgI5EWUjbrLiCVROTc2Q2roNPPEIzJw/HcoTadi+aj207doJ+wvzIGfcOBg6dhwU58sQy3KAqMaFRGui1CGK41REYn19Q4tDEg84jdSKkoB3YXVbVKJcN9Fnkpe6ljZodbokp0MsyAqMWJAXcM/L8Th+lO/3KIKeaoxHIyuDzY0f3P7HR9c+t/j9tl/e+L31b73Cgk1N3Crv5CWrpMjhG5dfBQ898U9obmoya6oqrYwKZQFEYExFd3SXpveqA+9XxcqDBxhYkURVZzlEym0mFGsXDfjqdtfyeVElJSiIIFrX8+D1fYY56H4SbU7xlBaji8h2NMPoG7vQcw8WipRaEW8rwDM24IeOnZti61d9GrEVq5N2XcVpTqT3gxi6lQck0KSoOMKwwEt+lr8o1zn9lHOHrj0UFGIJhfmopmZ2pabo2HiwCc6bPXHueRdfUfTqs0/WxWPRZh4d/4wDVznaOJCQ0Pw4ZUsJKSyQpBptweYk+ogqNr+t1PSYpiyQnetHn14gVyqVUhh7oFhD2rB28rBRvwzdNOaPGTHqxGyYJcfjLnqKtGLSRk5wAtUYonsCLg/2Ow31oRB4w50ww9TATWNH+2KhPxvfsRki738IvrnHQ/bV34WceBxKtmyGqjWfQ1VNPUSaW6Bx/RegeEQYWeCFkpIAZPud0pfjRhVsU4tSZtWGWdX1jfGH7//DS7f89p4R2MuZNe0JUaeFMKLEVpupyRQqFRFCaCXrg6IDfdYclst1iEXF2d6pJVneH3tFKYjdfH3S1Nn/WL3so32RSGcDzrlLUdKRjNW9/DvXw/1/fZry6AwiCrESCiSqtISSRgdlQxftqzkHFPsdNHhNnuelG7P9kHTL581YXuFrcKTI8hJgJB7t8GpGj2qngfJmK1VkBYoy4NXZ9gVCvxfLfEw+G0vVsI2HEPRKEjqCzWn0UzMasYVT5S29gTthyjT497J10NbSwgpFSGEQgAy+wQjttdXYmYCWaFKIJVVeuCFAwONEJagxl4TATEpy1e4amHP6hUPWr1q+d/uWDat5quBAb+D+5r4/w6VXX9+99pZrIYWl3VRm7SmOQE2XqfxPsi9+/0oH+tNsC2FmbWl8WZSfLL6amcNMCj9TTxydkue8rNypjRdiBkvIE0OIovIahvC+3SdBpWRAdSwKxQjc45QYjMbPdUUCw+uCZOUB6PzkU3COHQH+ObPAOFgNpscP/onTYOLU6TCypRESB/ZDS10dRIJN4IjEIQvS4PB5PGrWhN860t5rpTmXOE3JlbMx2Ljhf//80L0/+M6VN2UV582vi5vecMLaQomF3kSD71VG+9VY8oDeDbTHkuKOOlN0ynLpmOrgz2acfMZ3Xj/3wn86Xa5nSsoK9/3xjtsA3auu4iBa1qlqCpMHnY8VC5TRNKAvoxqOQU/E4C0vXyNK0VMy+5T2oI6ktaPvWdsXSz3c37TK7FKZ9AbLI6MFkwwYrGYgMkARPcMqOGYbtmpG38Vp3azZou4W3VStGAKLsBuZvwvcFyHLt5GDuOuYPH0WLFr6OSvuz0SuNUaRNJ4jFlCwkVM1KF2FE6QMpw4vMhZMGNKxpao5sP5gq8s0LB+/tjUMef4S168feGzCUw/94ZHPVy7bpw9g0yuha2GCRZtpclhaBAXGcLJ1JSIPeu3lVByOEchGLm0NKUqTUOCdaR77SKRVpgDd3V6K017Z6zOVUS4dXQGiyjTWKNRJ2igP/xrQVZinp+FkPQmm0omCn4a0KYPkC0C6tRHalq8EEX/2zZnHRNhkFgynpLWJ1n+Dk3ZSmT4HcufOA3HT5yDW7wVfNlJwnxNya5VWfzT8lhmprkx2NAWhs6Nj2z5T+NWXy+48YcHp1xx/8mkXFpaMKEg6sh0xFnvREKxpiDP3y4opyUhzBZ7oSiG72ngoCDtqOwomlef+YurQvIWSaPzmhp/9+g1stAoJtHQKgsEWlhYyBZ2lMEkeKCYgovGjijpdl/jOqf9B8NJUaKYVsGJbeUgmCy6pfE3g12F6iTaThZAplSJYwSNDHHx0hUWbeQqLQKKZOgOvIBxBSnm6KqVa1pIZDcliA9YOVQwTrTxFU2f3SWYcNxdeW7KyR3G/yWMERCPJAku28dG5Lz5/4nAYIkaWfPzmi0vKR0/6Xnlezsz9TRGWYabT1+6pg6K540f8+p4/nfXemy9vbG5uDFHBCR20mGLhVdcypRHp7OwV1bCUkJUusxQZuRFIZanGS+TPQWmmzX3UHg94mE86/dxJHo/v22kl5E+pGgevwpS606oVMKF7TSzFCuIuNZktKeCinXMpHUxd1PhI6vEkpJFB6D4/mKjpqHhC9HggHY9CcM1aSEWTUHTmqeDIysW/o2vjQWAiDg91hEBAK1bqCUEufldH8CtbN4NHjSCAfKD4HEr1jur3O+LpZ3NHTIJUZweVDRONF2LR6J6Pl7z9IrbkpGkzT5x34knFQ0eN9+bnlLiE4lyn4QrIsbQhNHVgH8Ixlgpz4RxQcQcNXAxBvmpfMwQjqZGnTiy7PcstNiSTyc+Z1kJf2u1yW+TQtOIuJJcJXgQkSnq/7tzAwCsMBLY8EESag+/Q4ODBK0U3BhtS6hc4GZ9a5gV7LIcsD06yhExgjRXHW7RZF/hyuH56KrAMpfW5wvKjumX9datGGFWAyOlqLaeusSMxiszPOrO81gRlVvOw2mbEz0mThkKxEfz8sft+/8yXX6z2XHjhNyMX/fA2szXmgab2CAM79fjjrVVw8cyh10qyhP6u+eFAR4FlBlRrIwD6N6XpXRVb/FmCNst7bAtLzjijOao7DAJrim06YK3tJYtqCqZ9mZ+1VLRgKkiuuC6q7QJb62xa9eSkHzvwYd3xGOTW1YDqzwJTs6ilbmjQ8uVGiFbVQcmCeeAuHQIqghw8Adjb2ApLgp1QyQRIg4kxBU4Jh2FkUyVICHjJi3Qb6W+HKWv1sRQVtbhDlTszgT7V5oLQajXXrm2bJWyjBUH0jhg12jt+4iTP0IqhvoIhIzxTRkzxyyNHe+s7E8KemmboTKSt/DMPdG6paSf3Z+qCMQW0LvjzwzeYt+raSZEymaC6ZtmyxjDIVw8dU7SZhNAy+wQG0aqw4jtFfMUaDWs06foUzeZVE2zLHXOQVj1Tg61YZZzM+grWUryj+c1WiSY9nwrW8k1yFUzmK1NNCljrhwe0Wt2SWFJ2KituYWWK+KHH5YBTJ1UANO2qvP/he5Yd3LeXNgCc+9FHH8D4qdMbhk8+rby1U5RobEnyW0Jx0uwFP7r1zge3rV5aHUsm90QiEXjpqcfgxssugN/971/hG1d+B6LhcI98vcIrxciKk5JlvpzRRT2EY5WBzLEGWYGENKCzOWTJBNJl2kGRFimo1uocgVeB6ULJmELTk1cKmjOAIjyFCCiOCmMIIRyT1xBCKxBKo1IGXFVZBVOzkVXn5qLuVKFt5w5o278P8qdOBE/FCFDQ+hKN3h3qhFda2qEZxzZXlth478JbHmpqhetQAUxzo8J0OtHPF81q3d3MFZVsq1gyeNWSxgNMa/i4nGKaxqjKg/tzsTHK73I55UmTp/rGTZjknzL35Lwzxk/O29KYlA42tgOlmiiWQWOwvyUCM8YOPWvJi0+888zjf9l02VXXwX2P/D0TsLLww+WLCpBkWeLK/D/s81o3N5mGtayaxCLDLFAxQNos9BNOE6Db5yUrIXeBV2dO/2CezeQBqxTfdNzyeXUrYNWn1e3Zp64+SBZ1t2gzS2SnM0n3viy3vfgkQ5NIq9LiAJXnxUlTTyzx6aFtnzQ9/8Rf9jU1NtBGcJQKylJVJfzGqy+8ffsfZ3+zPC9Qsau+TWDlZXi17bXtsHLboSlCPLnQKQuP2PO7fSpC0/LVU6q1MRy5Igy8SGPEr+je0L7Ty7bsRyWnsjc5sBVLZNlJQRk0dgr+nrasu7ukRJgy96rAyInzvR6f2iZ5k0JydYnS3kZrjgRKyG3AaXlXF6HGJH/EgLyGFij37IKsmbOguaMN6nfugkBZGQRGjwElidbY7YYkKq/9bSGoRMpajNNkaFYeux2BW1W1H85xpmG204VUWoCEJCqLayLv8RROnINX4bXVBGK49ff3Cf945EElGoms5cp5Aq+Uonx+fjqteDZv2pjEFvloyXttp595Vt6Mc64sN0tyA3sRwKSgiUkEI0liTeN0TaU9qTa9+crzoChpeOiJ56ChoZExQYoXJdkm9QZtgm9t2NCPhGfn5MLHG/dBKhX/iuDN7AVM/hMFg2Qrl0o+r+PrCF3yetxUBrwg8NLLvi9OIf3VO6qsZW8sMEXUV0YjqbLkFfVRz6SKkDarhnlkHSNkKqysiCBpU5IwpWu1kjDIuhaTLZmk8VI4bSYgBRxgbtuxJYzAJSEaxq9H+da9NVVVr1fv23Hg9NO+eUdDKFrS2B5j0Wh6osXr9sLls4b/PEuINnR0dLxKAkj5yXt+9RO2Jvmya75vvd1AsEpRVN3yr4j+Wz4v5ZvFrxSaoO13l2090LVFj8A3VaPXyzBrggwnpVmpKVM3JEGNJMyq9TuSjZuXqYLZqqlGfWSM9yY1IA4VJdGXpFJRicpgrUQ4zbuEY56OhqBux2Y4iLTYhRQ6b/wEMNAyazIqiGQK1Aj6uBStNyU2r1oyCY0tDdDQ2ghD0aYXZDlAd+D8uSQ4ZHg7P6lrXMErnjKHs7hsSMk1N958ud8fmBaNRRY98vSr7z32p3uT2zdv2GPoei0vginhdeQF/OeCUKjDv+iN15pxLMwJF3xvTHWnx9ESDIHHKUNjKAYdCS3H5XTRKjjaDslwoc9bWOCCznAA57Gli7lKqLAcst7v5gz5hUWwbMN+6Ix0Hrb17zHkeYUuH07hwQnqCFle+Wt4XSijmax2GrWYFbJhVs/kALQfTtSqy7cd4puJ9EiSTVFU46IDTWF3iu+8qHPr1d9iC6FXxIYVipAvLwvs5YT0OhNpIJTCnnzh6wMsTasxd4DAm+augOxwirY5iHBBWYZt34N3/27T3b6A//jhM371cSyd1xlPMZDUt4fho11S3m+uPO32dDyxXdO0zX2xh65XClCemZ5DtPrALK9+7PPk9fkYcJV0uldaztoRkQJktDEljTsFoQzaPFJPpCDWUqnGYK9quRypuo6iDSGfdF6BQxydwjEeh+0KpwDrEYTDsH8n+9zQIUpwoLaR7VJeXIrYSaYhJXvxdwX0WARM7MNQfJTxCQVWd3RAtL0V4uk4lCJgv4PacZQH6bsbqbRTSj9bk1iMMkpWV/V4vJBMJvQJk6ZPvOFnv7g95io4c2ttp2/uhAlTJYcqoVJ6f8zYCYnqygPhdDpNCrWa56dd/F8PK+9Eixxpb/mGZKhD0ZA7rHJQA9wuF2iJKHR2tJPFno1tGxqZtJMzFl3PuJ0qOJA2pzWZyafZC72oWOCTDXsgEgp/fbTZ2jUhs+RLYJFZTTcGbI7Ygm0BDussTnMSaWqj3+3ABzK7iiuaOxMQLs53zZg1K3vtmtW6y+3Rfv/go+ZFl30bOkPtzG/I4BkF/MfBSOyOxZuqctYfCooGjy4TfTQEA/qVW1uFlbWvsvV8btVgqz5Is4sDG54e2LUCFNZ4sbcmkGWRTPsOOwavV90K1gbo9E6WOKUPdu7a+djVJ5x6fmV78sR1+5sFpoBwkHbVd8AHmypHF6e1qzxORy2OUlt/ySKVz5OD0nua1QcDTDiWdQqB7Gz4eMNuSCUSvYdOME1LgdO8UXmkorJiEObuQM9tWtmqmcXV7StODGRfcm5AHq3JVjZhhsOAcQb5jk5QXQ7YHktAEq85LMsLRmsrNNXVo7vsAQmVNvmJBlp+IZWAkxEE+XheDT5zEYJ1jleEMR6RQIsSIRkfRRyVH9a3fsZLVwVavHvdD38yZtjkWXd80ahfuLlmt5jEfle2hiZeOX/cY/f99dmJv//ZDc/88fHnG95+7Z/qwb27VfwSC3ARuxk2ciQ88Lfn4bMlbw8P5Bdd1GH4PE1o7VltY9oAv1cGA7l9LBYlaz3dqroy60y7PGhW0Bfdfoim0tCe0KSy8gpvJhdeXjFcX7WzChrra/tNAsjHYhutm2tdQSoWNevyeQd4FdFqPcFrxt0uaXdpjocv5ZOYZW+P6LAvmJYuOvkbIy6qqZuwY9vmFaZpZPEHJWEI4G1PCifU63c3hE58c/0hiZa86YYVRLDW46L1phUcRw0MZFbjGIxZKOifGgKPDpvC4DUdt/rW+5OsZV9Ek/Tu1ECE54s/4bnjLsfG4XQmVi17/94z5pz6t8rmztFVrRFW0Ua52jdXboPrTxn3P698tPLgq889+eyrzz6tPHDHL5kAXX719yCBlgn4skhrrgQWJGHjkKnTHMSRm18AH67fCbSDYj9eMGNLrNiepfc0tlUSvQGRbxcjQveKKxcYurK601g5PeA8PsstlQqKybS3U5QhjeA9lNYhiNcod7vAh+whnEjCRlQI6xMxKBZicDJS51LRei8WYfQ4JDFzHQK40Hq73TjnCGCXT4Sdhtxxz67WRQiUHVZkWRC9fl/h6Olzb/x4X9tFuxojgtvpZPtSNXUk4B+f7i46d+bwO3/xx8cXyJryN7TCVD3XwWMcmU3sIBYJ53z7+h/+asmX+775yReH5HAsCW6kzFFkB3PGDoVUS2V0946tNB0jLKot1Fnyaq0WY/JA40PMEg1Ea1QRJg+p8JQUFwYkhyt36szZ+ZrGAi2Z/HgzdO/BdezRZp3nDy2KZPmkaleq6NidKbZ4QBYPlud5DxQE3GOoConeg0S2YsOhJlQShd4rbr7ryu+6pTlOSdpcWdtA28uMjqe12fubO2HV3mY42BxmPq4DQVJR4EetpuHEK9ZietGAgQT1WLSZB7vY+2QFKxcJwrH59Dqrj7asL/meDmuReqaOoo0HUfb1FYBCG7lUTEeeWzC+5LaGUCKLtDS9ia8xHIclW2o8syeNutrlcKzD623pq0jDygwY4JKNLlqrm4ObJ9pNZcm6bSiw/b8HnOZIMyyhJNZAlkUTZBBlMbNTnm5jGmxnobdrOl8d68mdemmh41qXaggpw4HOoQMaFQPqtRTk488FtKorlYIN+O1/GaKVm8Nvt+Gk/IgYjCywzRDpPiICWMLm8dKOIw44JDgjd+2NLgkpBq1zbsiYjVg00rZ746o3zjjxG5c2dOwsb4krgof2NMNLEfheXr0fvjzUcuqCCRWnXve7v1TleNzLvF5XFA1GjgiyE61leVN7eNYDb60NrN7fDLGUCk6U0/Z4GorzsmDyEK++Y9GK1spDtImltYe4aW0iZ6An0IF+cQxFLJ/leakME8dsd0MHjCkZXvjgq8suwyee6/G4a77csW8U4qpAFiRpSL7nB9i9V74yeKnES2X7Vlmv8ECH0AoEDdCVQhKHKgT9gj5KapEWVudly49eML3i0Sc+3SXFUODd9CpElID1B5th3YFmsTzfN7o81zeaQNYSSSHdiTCLSpFh8pdzfS44Z+pQOGtqecdjH+/Mbg4nJHoTuSBRvNnot5tdLisP51trUq2N6Gh5nfXFQb88ziqRpDHSrXf5kEK1bUCncGvUo9xx4VXXgdPtgSDSxSXv/PuZ639w8zk1odSCJZsr2TPSuG+sDsJb6w/NnTl26s9GDB9+Z23loerD4gf0HGyuRBZBZ/nqQRSrlQwphyVfbGdBsP42ameLLXh+njJqhmZtzqAZWmbM7HtrGTx1xEIIbzaknhni9Q6f63OcSlHhfWkT6tIpyPE6YLjoYIEpnF0Iox+r82wxvavFhwqMXh1HOWCBA5dCCH6ky9l+tLiCV/17orR9Z2xPkOfkM/s9O5KJROrt117+8sdDhv3mx+fPffylVbtz9qHyp1QiWWFSsPsaw7C1bgdk+dwjRhQEbsjyONi2r7SIoCOWgpq2GKu6cjusSAhFmPOzfPDtEyeYZtX65rWrV3ZwfLH2+gvPyJqmKs++/M+9w6oCu3P9zmEHWsLs++SodaKBeWb5Hgh4XB40XGMDbnlsYygOkaQK48pytD8snH2ZRxTeNG1yIsMgqzRoh2MUBoHC3FQ6xkLcaWs7UYEo6gByEO+/8QLSOQ0efPplCDb3dNeQUiQ9Lsdbp08ZOiuUSH/3rQ3VchCtjM/rYlFaunptWxSqWiLdb4nnhRxepC1zRhXCwhOnNJ87tWL97qra4mhamZlIqxKrsKL9Cgyh7zRJd8SKXvkgGBRtweeKO0RmVZjPS1vQCUcr+xS6hJzvBCIigIQk3xOLBIN8dApa8DdRC0crRPd4fcEX/v7YLxZcePkzexuyp26rCSJVlCCBGv/5j9bDrJ9/5+ozz1+4vbWp4dG//+lejS57JVLnjlgLS7MRlU2gkKd5VoAGQBKlAb97h0oOqR2p1JUgmWD14FbZp4aMR0H/T3B3jbZ9+5t0JsdcFU3ufHS//rAxNts9IU+e1x5C4PrcMBInwplOQ1Sj0l8ZpuP149golUT1z7MlWp+AilCyqLIXgZuPvia4JPP9kHLglZD2abKi8FSfvyEQ70jYN+knFeCIx2LKXx+8a/FPf31H8c8vOP2GNZUdY8kw7KlrR8WjMBAjo4F0WoWd+JnB60zYPtSitRc17RjSEVHYO6GJKl97+vRkYv+6XY89+XBLY0N95m31MZ5FMChW0BHWa4fmBZadO63i3OpgBFpDCZxfB3PvyKWKoOUPJVLctbHcN7Tq+KuZLi4byl7APqUs0Gv3SMEcEHgpI+CQJcOHQKFf3Eht0ll+IHKbjMeo7HZAu4m7XU4oyqWCmJy+pKHVVL1/vGxmunN4Ue6PPq9sc63fWw9tqIn4Tt4ZpIM/xwtluT6YNrwYFkwbFZk6JOeTV/5671Nb3zTqT7n0umfzsgJyVpjt2Ad+n592l0OfMa0ftuEAD47hKCm08yttqSK5ZfBhP2Wnm+3YmEqmdB6tHqj5ZdkqZAQuj9Nh5fQQdNkonNgXsS6V6neD+9ee+ztcce2NkJWTy1gFKoANRVnup68+eeIfHvtwW357NIXX8UB7NAGvf7YRLp067xuTpn+xorrqzU2SQwaH161JskN04f3ceG+/y8lWy3jRgijJuJ5MxrUBl0MerfoGjSDKc8CHY0Q7g7EVUihatK9UPBpW+AaGmQorxUah2ZY0lTFl6UP7wsqCMvePZxc6z5juk7xSTIUgKlo3+sBkGIpxbi7kAYJ8WiYqWsDNRjOc45HQ6spQrRipd2vTX3zYFH9TlbR3KobEoaBidEWiMzjCNPQq6H6tCtuSJ5VKJf98/93Pn37Wl3UVw0ZcfeHEOSeeNW12dk1HSthe3QoNoRjE0Nem1V7AS3X5W/AgEHBDcXYAxpYXwBmzJyhlYvTzDR/9c+MbLz3vqqutGcH94zh3i5jPLKAvL7glxe3xvXXm1IqxpUUF1727sdK5taoJGhHIbCF7L+vg9DihNDcA5UOHmJ8tfV/54ZUXH06bB5LlYTuqCubbc0cXjh1TmnOF7HB706mEnFY1r6TGtY+3b+psD3Xqx1gj291hh2Ts21+1/5ffu+zBCRMnh4475bzvnXLW+ApXNk4b1fTyzrJKJYcQynKKh4xw68rF//jD2rfa2vevWbFM0VR1Zjiltp120rmRCyaOy0I/jJxM7dDWNR27t21B11HpAUIySJSbjKf1hNfpXHbdKeNnXD5/bL7X7dLwXG/dni2pZSuWtsWSafvrJXuzBpa7S2tdmMSTzc/mji76y8jCrCvcXr8zmYg5YpFOeefajzpWffZJBxxhZU9DbTWE2oNdKbIH7/rtCz+85bbRt18087rW9vYA8VPR4XToiqru2bC68VDlISWJPnFDfR20tbel0Il48/J5YyacP3v0GKcsq9Fo1GtoiuPQplWdW3bsSkDfm533kR0w+Q6u/XoGVaV5/r/cd83p39ZVzZOIRV2JZMqtp2Kw4s3PQ5FoNGP1gAPXrjiYV9IYV9b8+5DasD3o+OSCEveF83PluWVuZ5aiWMtDdR7tLxUyu3YAUw5hQTTWRrXmzQ3xrZsi2taGhEZLNNeDkY4H66qWj5gx/wcur29EKhbxcguo28ZcRCZrfLzkXQoUfjJ2zFjHsFGjhw0bPy1r4fjp2TnFY12yxy8z5sH3UgP+fiGPUwwVZvkPRhsrt2784OkdLyz7uGnPnl0V9Eod6N48LshjGQ2ZcSaXxZ+bUxNsrPrFtnee/mRKybAfnXPunBNMh89FlWB2ILLlsA4pniWrK1999onXn/zTfT7ed/Ycg/Z50a8JjhxS9IfCztCTj9z3u7K927ee4nQ5F8Tjieym5iakGcqAqiQXv2pVnTz75ivQEtT6KL4QIR6Lt7377zf/vXbVck9xcfFJXq/XJzL6xl4/QJUILeg/1qJmbwx1hltrqysdKOi0WwLtI1T2zivPuTas+Ggtfq8aBz5hGPrwlpaWolAoJPZWMNZ7Uq3qMZyel0+YNvaT2kMHXE8/ev/4rRu+uBj7Mr41GNQG6/Sigagrywv8dlhh9lM/vf7KYvQdT1EUZX5jQ4M3Foupg7ledm5e9KE7b7vHUJV12OOzTVMfI4qyD58/XVdX1xKPx6hKy/vso39K0BK0n95x7wdlIGxc9OJTBS8/9fgovz9wrqqp09va2qVgMKgOJObR3FAP58ycAB9s3EUR1v5OS5cWFt/90PWX/DPc0R5Al4heqXpuKpUubWhsFJLJZF+ugf11myzLgjR4V2VU3fNoVH37Tbc4dZxPmjUp23F8oVsa55fEQgSsP6YZyYghhUNiQKwJKaGt9c2fhXShMaqaFLGnxe8tVozQdMTbmlYc+mJZXEkmTJ6bTfRK6WfKJMlCbt9/YL8H2wzPyuWlRUVF7qysLNHlYpvzxy3rKXTQLsT0bnTEAWmkWHtbW6KxscGvKgptyzqSl1pmFq/QbidbeCqwd41CrK66asnHj/8lNXb8hHaP2zWGFpvwXU2T/PtBpIhtiUSy5dDBA3lImekdXgf5NTuOKWCVl58fv+GKiyo3r19LO0eM4p1z2sLaAxLIJYtehRLh1SMHalFrtbW1rcBG1868tS1TlRHgofgyTlP8/O/0XElUDrXVVVVbwFrATvs+nce1oqf3je799c0sh3f5NTdCONQWD2S5K5csfhMW/etlkVMf5WiMYuuGdXDF2SfA6x+v6fG+H9TayNBS+9auXtXGxysK3W857L9u+LOlcMKpZ/TYyVN2ONr37t/zYSqZ1PjzDOfPTmV8J1lKDXa98MSjutPpMe55+IHmlqam5sqqKjp/JhdULwxiFRHth3Vced7RTlPmzJ13cMf2bbTRPOU3aQO1XOi5FFDvg2l0vRM3YpW/0XnNVXE9WB3XV6xoU/IdklCODBmNrpCl0a7oLm8wd9T4qYJfPL821bwWv76ZC7VpUwo6UuVgItJBL7zzcT+7RyDelvrJbORH/4ZQ2UyuqamhTQWzoPu9vm4uQ5myymIuZz7+eUamElZelwF3Na/oYpP3/qJX0LilYPG7i+C1z7bC+28vouvs27Vzxzrel2zoXoHl4uPn40rBx90M6u/eQUeb8wqK4NLT58CBPbvstNvgHY7zAUpkfBn4eo4wH4hMMcM4XgecqXjJsQE9zc8hulLJNfEursUm837F+cTFeN7ssH4WlZbBrTfeCK+/8DTYJisTrcw854CeD/1OqK2qhCvOOan7xfTWGEV5nxNwhB0xPl++rL8xoaKOUtskCxzIE7jwBPMLCuGR+x+Gpx79U2arVZU/d+YFcHE4wovlBpvU/nLdF5kXemUWI8S4jKT7kAkBer742v47NQ95RSkDoinD5PNvWq8D1RKGOxb1FA4dIXF/sgp6vobTXnJn8LG2k6yM4sr0ycvHo4pfby83FKM4SLM4ePJ5iWRvA5PmMkayR1v87OCtoffcfvLeW+Dv9msNfs7nXMlN4HPp4ffrnY5J8ab1AO+pU0ccy4TRhQ7xG/ttArIHuvdF+joqJmlA1/EHHceFNKeX8lF5PINMHpWl1HEQJ/k12rkSaOH9bOMVN12c/cHf3cqKEfbu3JoBLnBLlll0L/AJqrRp8h7Hzq2bYFKxp79nSfK0hYNPjMEnvekYQETPuJIDOQ+694qO8nER/njHrfY3FYQ44CM2pdvAx+HrmqcMAGlc13JrKPJn2w3d26ZmVjNl+px5471hU6iZ9FnGEmUsKp2XQt9dlbzZgje/WE60tyi2Pgykn6KtXyqfS9nmp4Z434lBDOHMroAbDBl6rinNyF2Qj2ctl5XYAPuT5EDv5GNUwefT2YeSaLVjS8gEQ4Rjq1QXudbyQM/3qyZswYGv8xBtGskBPd9EaNpypn1ZM5fte5k3xsUHwBIyisn+rtcEv48xyP5LfKzslFnl1xuwNT9C38D2XL2vl1EYbjvV5UKmfI1zJPH+ePmY219KnbQBxgHdb643oOfLrvVe1li2WWX6XjJQXHFc+fST/qezZs/Spr2bX7XdW7fJiv11nv1t6JZRCBn/NxORVqF78wAfP0fsJ6Og2FincoysM7MXtN92L6GXfKf4fCURt8b/J8AAho1eGn6NG9gAAAAASUVORK5CYII="/>
								</td>
								<td>
									<table>
										<tbody>
											<tr>
												<td colspan="4" style="color:black;font-weight:bold;font-size:16px; padding-left:4px; text-align: center;">
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
					<table cellspacing="0px" width="793" cellpadding="0px">
						<tbody>
							<tr style="height:118px; " valign="top">
								<td width="40%" valign="top" style="padding-top:10px">
									<table id="customerPartyTable" align="left" border="0" height="50%" style="margin-bottom: 5px;border: 1px solid #199BDC; border-left-width:5px; width:95%; margin-left:-2px">
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
									<img alt="" width="100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAACqCAMAAAAgGNUfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTRDOEE2Mzg2MEQ4MTFFNzlBMzhBNEZFQkREOUU3NUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTRDOEE2Mzc2MEQ4MTFFNzlBMzhBNEZFQkREOUU3NUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjZENUVGN0YzMkVGOEZBNEIyNEFDOEE5QUJFRTFGMzQwIiBzdFJlZjpkb2N1bWVudElEPSI2RDVFRjdGMzJFRjhGQTRCMjRBQzhBOUFCRUUxRjM0MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrSVbaoAAAGAUExURf39/7e45wsKj05UxcfG673B6ispkOrt+9nk942V5gIBX/n5/qeq5Jab2qak2DpCr9bT6/T6/nmEz+zw+5ml5srU83h5x0dJuIOI2GZqyJyh2ai05uHi9QEBiDY6pWVluvHs+FhZvERHq+bq/KKdzfX3/m11xsDL7dva8MC84oh7wIeHxdLV8uvq9uPj+svF4YqR19TM5ikppzk7tfn8/ldiycnQ60M8n1pktkdSueHd8C0ypfn2/Hd80vD2/bi21vDw/lZUq1BGmHx3uB8qo7Gr2drd+B8kmJWWzGp00ePr9tPd7+jl9PX0+oyWzqqw22lkpmVxvGBs1m144dHd+B4ahmNdq7Gx5fLx+fv7/lVNt5WNyPTx9XJwypWP1Orj6nJtt01MqaapwNjW8hYYmEpUotLV+/bw+S84xM7O8bm/8XJqqkRFwS04seno+19gyCQtrtvT+/Pz/vHz/Pn6+jMxmv75+/7693Ft2CAgpP/++/j39a+66t3U4P///////8zinf8AAACAdFJOU/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AOAVLZwAADzhJREFUeNrsnPtf2kqwwJcE8BEwKshLwktREUEEFBGwUhWqFa1tEWOPHqlRjxbUQ+X00NsO//rlTRAFEhVO7ufml5Z+upvvTmZnZ2ZnF+UF/KD/h3+FBy4vQbDwyGFCgoV3rM/GQKjwkmjgDAkVXpz26IUKDyK3uk+oaoM0mEGw8FYtZZgQKnyfFrN8Fyq83kIte4Vq58+igzqhrrBgw7A5oa6waHJQ6hQqPHE6mN0Rqto4spTlu0BdYthkmH1aoPDoFEvJkUDhnQZGvQfChEcJBiOXBCp5+phh0nqBSt6kzjGBPmEG4GAj7zC1VZjwhNbjwaYIYcLrPbiH2kWChIc3f2lI6o0w4a1G8zVJ2WghwsOZYfcii0kECU+7AmOf3ZhYkGpjMuOrYiY3J0R4dObZAhmWNuUFCA+JwDiEKDMSIjxhxhU/b6kQLUB40HtGIWimXBkhwusCkjyhpmT3AoRHU4ZIPmbA5kB48LBm3rfm9UxOnxcePJKkC+GfmNmICFDy9NTdXJ5OYBvb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"/>
								</td>
								<td width="33%" align="center" valign="top" colspan="2" style="padding-top:10px">
									<table border="0" height="13" id="despatchTable" style="border: 1px solid black; margin-right: -2px;">
										<tbody>
											<xsl:if test="n1:Invoice/cbc:CustomizationID !=''">
												<tr style="height:13px; ">
													<td style="width:105px; padding:4px;background-color: #199BDC; color: white; " align="left">
														<span style="font-weight:bold; ">
															<xsl:text>Özelleştirme No</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding:4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #199BDC; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Senaryo</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #199BDC; color: white; ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tipi</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #199BDC;color:white ">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura No</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #199BDC; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tarihi</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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
													<td align="left" style="width:105px; padding: 4px; background-color: #199BDC; color:white">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Zamanı</xsl:text>
														</span>
													</td>
													<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
														<span>:</span>
													</td>
													<td align="left" style="padding: 4px;">
														<xsl:if test="n1:Invoice/cbc:IssueTime != ''"><xsl:value-of select="n1:Invoice/cbc:IssueTime"/></xsl:if>
										
													</td>
												</tr>
												<xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
													<xsl:if test="cbc:ID !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px;background-color: #199BDC; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye No :</xsl:text>
																</span>
															</td>
															<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
																<span>:</span>
															</td>
															<td align="left" style="padding: 4px">
																<xsl:value-of select="cbc:ID"/>
															</td>
														</tr>
													</xsl:if>
													<xsl:if test="cbc:IssueDate !=''">
														<tr style="height:13px; ">
															<td align="left" style="width:105px; padding: 4px; background-color: #199BDC; color: white; ">
																<span style="font-weight:bold; ">
																	<xsl:text>İrsaliye Tarihi :</xsl:text>
																</span>
															</td>
															<td style="background-color: #199BDC;border-color:lightgray; width:1px; font-weight:bold;color:white;padding: 4px">
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

					<table id="lineTable" width="793px" style="border-top: 1px solid darkgray;padding:10px 0px; border-bottom:2px solid #199BDC;width:100%; margin-top:5px">
						<tbody>
								<tr id="lineTableTr">
								<td id="lineTableTd" style="width:3%; background-color: #199BDC; color: white;">
									<span style="font-weight:bold; background-color: #199BDC; color: white;" align="center">
										<xsl:text>Sıra No</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:20%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Mal Hizmet</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7.4%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold;">
										<xsl:text>Miktar</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:9%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Birim Fiyat</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:9%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>İskonto Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:7%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Oranı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:10%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Tutarı</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:17%; background-color: #199BDC; color: white;" align="center">
									<span style="font-weight:bold; ">
										<xsl:text>Diğer Vergiler</xsl:text>
									</span>
								</td>
								<td id="lineTableTd" style="width:10.6%; background-color: #199BDC; color: white;" align="center">
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
						</tbody>
					</table>
				</xsl:for-each>
				<xsl:variable name="allowTotStyle">
					<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount != 0">min-height:121px;</xsl:if>
				</xsl:variable>
				<table  width="793px">
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
						<td id="budgetContainerDummyTd"/>
						<td id="lineTableBudgetTd" align="right" width="200px">
							<span style="font-weight:bold; ">
								<xsl:text>Mal Hizmet Toplam Tutarı</xsl:text>
							</span>
						</td>
						<td id="lineTableBudgetTd" style="width:81px; " align="right">
							<span>
								<xsl:value-of
									select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if
										test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if
										test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
										<xsl:value-of
											select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID"
										/>
									</xsl:if>
								</xsl:if>
							</span>
						</td>
					</tr>
					<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
						<xsl:if test="cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode = '4171'">
							<tr id="budgetContainerTr" align="right">
								<td id="budgetContainerDummyTd"/>
								<td id="lineTableBudgetTd" align="right" width="200px">
									<span style="font-weight:bold; ">
										<xsl:text>Teslim Bedeli</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:81px; " align="right">
									<span>
										<xsl:value-of
											select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
										<xsl:if
											test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID">
											<xsl:text> </xsl:text>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRY'">
												<xsl:text>TL</xsl:text>
											</xsl:if>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
												<xsl:value-of
													select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID"
												/>
											</xsl:if>
										</xsl:if>
									</span>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
					<tr id="budgetContainerTr" align="right">
						<td id="budgetContainerDummyTd"/>
						<td id="lineTableBudgetTd" align="right" width="200px">
							<span style="font-weight:bold; ">
								<xsl:text>Toplam İskonto</xsl:text>
							</span>
						</td>
						<td id="lineTableBudgetTd" style="width:81px; " align="right">
							<span>
								<xsl:value-of
									select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount, '###.##0,00', 'european')"/>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID">
									<xsl:text> </xsl:text>
									<xsl:if
										test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID = 'TRY'">
										<xsl:text>TL</xsl:text>
									</xsl:if>
									<xsl:if
										test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID != 'TRY' ">
										<xsl:value-of
											select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID"
										/>
									</xsl:if>
								</xsl:if>
							</span>
						</td>
					</tr>
					<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
						<tr id="budgetContainerTr" align="right">
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Hesaplanan </xsl:text>
									<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
									<xsl:text>(%</xsl:text>
									<xsl:value-of select="cbc:Percent"/>
									<xsl:text>)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
									<xsl:text> </xsl:text>
									<xsl:value-of
										select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
									<xsl:if test="../../cbc:TaxAmount/@currencyID">
										<xsl:text> </xsl:text>
										<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
											<xsl:text>TL</xsl:text>
										</xsl:if>
										<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
											<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
										</xsl:if>
									</xsl:if>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:for-each>
					<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
						<xsl:if test="cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode = '4171'">
							<tr id="budgetContainerTr" align="right">
								<td id="budgetContainerDummyTd"/>
								<td id="lineTableBudgetTd" align="right" width="200px">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Matrahı</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:81px; " align="right">
									<span>
										<xsl:value-of
												select="format-number(sum(//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=0015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>										
										<xsl:if
											test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID">
											<xsl:text> </xsl:text>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRY'">
												<xsl:text>TL</xsl:text>
											</xsl:if>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRY'">
												<xsl:value-of
													select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID"
												/>
											</xsl:if>
										</xsl:if>
									</span>
								</td>
							</tr>
							<tr id="budgetContainerTr" align="right">
								<td id="budgetContainerDummyTd"/>
								<td id="lineTableBudgetTd" align="right" width="200px">
									<span style="font-weight:bold; ">
										<xsl:text>Tevkifat Dahil Toplam Tutar</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:81px; " align="right">
									<span>
										<xsl:value-of
											select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount, '###.##0,00', 'european')"/>
										<xsl:if
											test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID">
											<xsl:text> </xsl:text>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRY'">
												<xsl:text>TL</xsl:text>
											</xsl:if>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRY'">
												<xsl:value-of
													select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID"
												/>
											</xsl:if>
										</xsl:if>
									</span>
								</td>
							</tr>
							<tr id="budgetContainerTr" align="right">
								<td id="budgetContainerDummyTd"/>
								<td id="lineTableBudgetTd" align="right" width="200px">
									<span style="font-weight:bold; ">
										<xsl:text>Tevkifat Hariç Toplam Tutar</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:81px; " align="right">
									<span>
										<xsl:value-of
											select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount, '###.##0,00', 'european')"/>
										<xsl:if
											test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID">
											<xsl:text> </xsl:text>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRY'">
												<xsl:text>TL</xsl:text>
											</xsl:if>
											<xsl:if
												test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRY'">
												<xsl:value-of
													select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID"
												/>
											</xsl:if>
										</xsl:if>
									</span>
								</td>
							</tr>
						</xsl:if>						
					</xsl:for-each>
					<xsl:for-each select="n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal">
						<tr id="budgetContainerTr" align="right">
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Hesaplanan KDV Tevkifat</xsl:text>
									<xsl:text>(%</xsl:text>
									<xsl:value-of select="cbc:Percent"/>
									<xsl:text>)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
									<xsl:text> </xsl:text>
									<xsl:value-of
										select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
									<xsl:if test="../../cbc:TaxAmount/@currencyID">
										<xsl:text> </xsl:text>
										<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
											<xsl:text>TL</xsl:text>
										</xsl:if>
										<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
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
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of
									select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
						<tr id="budgetContainerTr" align="right">
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Üzerinden Hes. KDV</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of
									select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
					</xsl:if>					
					<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
						<tr id="budgetContainerTr" align="right">
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test = "//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
								</xsl:if>								
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
						<tr id="budgetContainerTr" align="right">
							<td id="budgetContainerDummyTd"/>
							<td id="lineTableBudgetTd" width="211px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Tevkifata Tabi İşlem Üzerinden Hes. KDV</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:if test = "n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test = "//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
									<xsl:value-of
										select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
									<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
								</xsl:if>
							</td>
						</tr>
					</xsl:if>
					<tr id="budgetContainerTr" align="right">
						<td id="budgetContainerDummyTd"/>
						<td id="lineTableBudgetTd" width="200px" align="right">
							<span style="font-weight:bold; ">
								<xsl:text>Vergiler Dahil Toplam Tutar</xsl:text>
							</span>
						</td>
						<td id="lineTableBudgetTd" style="width:82px; " align="right">
							<xsl:value-of
								select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount, '###.##0,00', 'european')"/>
							<xsl:if
								test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID">
								<xsl:text> </xsl:text>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRY'">
									<xsl:value-of
									select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID"
									/>
								</xsl:if>
							</xsl:if>
						</td>
					</tr>
					<tr id="budgetContainerTr" align="right">
						<td id="budgetContainerDummyTd"/>
						<td id="lineTableBudgetTd" width="200px" align="right">
							<span style="font-weight:bold; ">
								<xsl:text>Ödenecek Tutar</xsl:text>
							</span>
						</td>
						<td id="lineTableBudgetTd" style="width:82px; " align="right">
							<xsl:value-of
								select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount, '###.##0,00', 'european')"/>
							<xsl:if
								test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID">
								<xsl:text> </xsl:text>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if
									test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRY'">
									<xsl:value-of
									select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID"
									/>
								</xsl:if>
							</xsl:if>
						</td>
					</tr>
					<xsl:if
						test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
						<tr align="right">
							<td/>
							<td id="lineTableBudgetTd" align="right" width="200px">
								<span style="font-weight:bold; ">
									<xsl:text>Mal Hizmet Toplam Tutarı(TL)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:81px; " align="right">
								<span>
									<xsl:value-of
										select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
									<xsl:text> TL</xsl:text>
								</span>
							</td>
						</tr>
						<tr id="budgetContainerTr" align="right">
							<td/>
							<td id="lineTableBudgetTd" width="200px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Vergiler Dahil Toplam Tutar(TL)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of
									select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
								<xsl:text> TL</xsl:text>
							</td>
						</tr>
						<tr align="right">
							<td/>
							<td id="lineTableBudgetTd" width="200px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Ödenecek Tutar(TL)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of
									select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
								<xsl:text> TL</xsl:text>
							</td>
						</tr>
					</xsl:if>
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
								<table id="hesapBilgileri" style="border-top: 1px solid darkgray;padding:10px 0px; border-bottom:2px solid #199BDC;width:100%; margin-top:5px">
									<tr>
										<td style="width:100%; padding:0px">
											<fieldset style="margin:2px">
												<legend style="background-color:white">
													<b>BANKA HESAP BİLGİLERİMİZ</b>
												</legend>
												<table style="width:100%" id="bankingTable" border="1">
<!--<table border="0" width="793px" id="bankingTable" style="font-size: 11px; font-weight: bold; margin-left:-11px">-->
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
		<td>ZİRAAT BANKASI</td>
		<td>GALATASARAY ŞUBESİ (701)</td>
		<td align="left">64168701-5001</td>
		<td>TR48 0001 0007 0164 1687 0150 01</td>
	</tr>
	<tr>
		<td>İŞ BANKASI</td>
		<td>BEYOĞLU ŞUBESİ (1011)</td>
		<td align="left">1820158</td>
		<td>TR86 0006 4000 0011 0111 8201 58</td>
	</tr>
	<tr>
		<td>DENİZBANK TL</td>
		<td>BEYOĞLU ŞUBESİ (9750)</td>
		<td align="left">841245-353</td>
		<td>TR46 0013 4000 0008 4124 5000 09</td>
	</tr>
	<tr>
		<td>DENİZBANK USD</td>
		<td>BEYOĞLU ŞUBESİ (9750)</td>
		<td align="left">841245-354</td>
		<td>TR19 0013 4000 0008 4124 5000 10</td>
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
		<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"
			/>-<xsl:value-of select="substring(.,1,4)"/>
	</xsl:template>
	<xsl:template match="//n1:Invoice/cac:InvoiceLine">
		<tr id="lineTableTr">
			<td id="lineTableTd">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="./cbc:ID"/>
				</span>
			</td>
			<td id="lineTableTd">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Name"/>
					<!--	<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:BrandName"/>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:ModelName"/>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="./cac:Item/cbc:Description"/>-->
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
						select="format-number(./cbc:InvoicedQuantity, '###.###,####', 'european')"/>
					<xsl:if test="./cbc:InvoicedQuantity/@unitCode">
						<xsl:for-each select="./cbc:InvoicedQuantity">
							<xsl:text> </xsl:text>
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
								<xsl:when test="@unitCode  = 'LTR'">
									<span>
										<xsl:text>LT</xsl:text>
									</span>
								</xsl:when>

								<xsl:when test="@unitCode  = 'NIU'">
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
								<xsl:when test="@unitCode  = 'KWH'">
									<span>
										<xsl:text> KWH</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'ANN'">
									<span>
										<xsl:text> Yıl</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'HUR'">
									<span>
										<xsl:text> Saat</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D61'">
									<span>
										<xsl:text> Dakika</xsl:text>
									</span>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D62'">
									<span>
										<xsl:text> Saniye</xsl:text>
									</span>
								</xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:if>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
						select="format-number(./cac:Price/cbc:PriceAmount, '###.##0,########', 'european')"/>
					<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID = &quot;TRL&quot; or ./cac:Price/cbc:PriceAmount/@currencyID = &quot;TRY&quot;">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID != &quot;TRL&quot; and ./cac:Price/cbc:PriceAmount/@currencyID != &quot;TRY&quot;">
							<xsl:value-of select="./cac:Price/cbc:PriceAmount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:if test="./cac:AllowanceCharge/cbc:MultiplierFactorNumeric">
						<xsl:text> %</xsl:text>
						<xsl:value-of
							select="format-number(./cac:AllowanceCharge/cbc:MultiplierFactorNumeric * 100, '###.##0,00', 'european')"
						/>
					</xsl:if>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:if test="./cac:AllowanceCharge">
						<!--<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = true() ">+
										</xsl:if>
						<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = false() ">-
										</xsl:if>-->
						<xsl:value-of
							select="format-number(./cac:AllowanceCharge/cbc:Amount, '###.##0,00', 'european')"
						/>
					</xsl:if>
					<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID = 'TRL' or ./cac:AllowanceCharge/cbc:Amount/@currencyID = 'TRY'">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID != 'TRL' and ./cac:AllowanceCharge/cbc:Amount/@currencyID != 'TRY' ">
							<xsl:value-of select="./cac:AllowanceCharge/cbc:Amount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
						select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode='0015' ">
							<xsl:text> </xsl:text>
							<xsl:if test="../../cbc:Percent">
								<xsl:text> %</xsl:text>
								<xsl:value-of
									select="format-number(../../cbc:Percent, '###.##0,00', 'european')"
								/>
							</xsl:if>
						</xsl:if>
					</xsl:for-each>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
						select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode='0015' ">
							<xsl:text> </xsl:text>
							<xsl:value-of
								select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
							<xsl:if test="../../cbc:TaxAmount/@currencyID">
								<xsl:text> </xsl:text>
								<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
									<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
								</xsl:if>
							</xsl:if>
						</xsl:if>
					</xsl:for-each>
				</span>
			</td>
			<td id="lineTableTd" style="font-size: xx-small" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
						select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode!='0015' ">
							<xsl:text> </xsl:text>
							<xsl:value-of select="cbc:Name"/>
							<xsl:if test="../../cbc:Percent">
								<xsl:text> (%</xsl:text>
								<xsl:value-of
									select="format-number(../../cbc:Percent, '###.##0,00', 'european')"/>
								<xsl:text>)=</xsl:text>
							</xsl:if>
							<xsl:value-of
								select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
							<xsl:if test="../../cbc:TaxAmount/@currencyID">
								<xsl:text> </xsl:text>
								<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
									<xsl:text>TL</xsl:text><xsl:text>&#10;</xsl:text>
								</xsl:if>
								<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
									<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/><xsl:text>&#10;</xsl:text>
								</xsl:if>
							</xsl:if>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each
						select="./cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:text>KDV TEVKİFAT </xsl:text>
							<xsl:if test="../../cbc:Percent">
								<xsl:text> (%</xsl:text>
								<xsl:value-of
									select="format-number(../../cbc:Percent, '###.##0,00', 'european')"/>
								<xsl:text>)=</xsl:text>
							</xsl:if>
							<xsl:value-of
								select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
							<xsl:if test="../../cbc:TaxAmount/@currencyID">
								<xsl:text> </xsl:text>
								<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
									<xsl:text>TL</xsl:text><xsl:text>&#10;</xsl:text>
								</xsl:if>
								<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
									<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/><xsl:text>&#10;</xsl:text>
								</xsl:if>
							</xsl:if>
					</xsl:for-each>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
						select="format-number(./cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
					<xsl:if test="./cbc:LineExtensionAmount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cbc:LineExtensionAmount/@currencyID = 'TRL' or ./cbc:LineExtensionAmount/@currencyID = 'TRY' ">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cbc:LineExtensionAmount/@currencyID != 'TRL' and ./cbc:LineExtensionAmount/@currencyID != 'TRY'">
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
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
			<td id="lineTableTd" align="right">
				<span>
					<xsl:text>&#160;</xsl:text>
				</span>
			</td>
		</tr>
	</xsl:template>
</xsl:stylesheet>
