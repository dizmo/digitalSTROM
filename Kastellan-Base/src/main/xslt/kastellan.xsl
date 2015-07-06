<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:import href="../../../../Arteria-Base/src/main/xslt/common.xsl"></xsl:import>

  <xsl:variable name="pagename">Kastellan</xsl:variable>

  <xsl:template name="scripts">
    <xsl:copy-of select="files/scripts/*[position()&lt;last()]"/>
    <xsl:copy-of select="files/scripts/*[position()=last()]"/>
  </xsl:template>

  <xsl:template match="/">
    <xsl:call-template name="html" />
  </xsl:template>
  
  <xsl:template name="head">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <xsl:comment>#if expr="(${HTTP_USER_AGENT} = /iPhone/)"</xsl:comment>
	  	<meta name="viewport" content="initial-scale=2.3, user-scalable = yes,width=256,height=256,minimum-scale=0,maximum-scale=10"/>
	<xsl:comment><xsl:text>#else </xsl:text></xsl:comment>
	  	<meta name="viewport" content="initial-scale=2.3, user-scalable = yes,width=6000,height=6000,minimum-scale=0,maximum-scale=10"/>
	<xsl:comment><xsl:text>#endif </xsl:text></xsl:comment>
  </xsl:template>

  <xsl:template name="body">
    <xsl:call-template name="version"/>
    <div class="kastellan_main_container"></div>
  </xsl:template>

</xsl:stylesheet>

