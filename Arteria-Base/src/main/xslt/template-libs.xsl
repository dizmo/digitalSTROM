<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="bodyclass">arteria-body</xsl:param>
  <xsl:param name="pagetitleprefix"></xsl:param>
  <xsl:param name="bodystyle"></xsl:param>

  <xsl:template name="version">
    <script type="text/javascript">
      window.flab = { 'versionstore' : '<xsl:value-of select="//version/@version"/>.<xsl:value-of select="//version/@release"/>'};
    </script>
  </xsl:template>

  <xsl:template name="stylesheets">
    <xsl:copy-of select="files/stylesheets/*"/>
  </xsl:template>

  <xsl:template name="scripts">
    <xsl:copy-of select="files/scripts/*"/>
  </xsl:template>
  
  <xsl:template name="loading">
    <div id="loading-text">Loading <xsl:value-of select="$pagename"/>, please wait...</div>
    <div class="flab-loading-animation"><img id="loading-anim" src="css/img/progress-anim-50x50.gif" alt="Loading animation"/></div>
  </xsl:template>

  <xsl:template name="head"></xsl:template>
  <xsl:template name="foot"></xsl:template>

  <xsl:template name="html">
    <html>
      <xsl:comment> This file was auto-generated. Please do not edit it by hand as changes will be overwritten. </xsl:comment>
      <head>
        <title><xsl:value-of select="$pagetitleprefix"/><xsl:value-of select="$pagename"/></title>
	    <xsl:call-template name="meta" />
        <xsl:call-template name="stylesheets" />
        <xsl:call-template name="head" />
      </head>
      <body class="{$bodyclass}" style="{$bodystyle}">
        <noscript>
	      <p>
            <code>
              This page requires JavaScript. Please enable it or use a browser
              which is capable of JavaScript, such as <a
              href="http://firefox.com/">Mozilla Firefox</a>.
            </code>
          </p>
        </noscript>
        <xsl:call-template name="body" />
        
        <xsl:call-template name="scripts" />
        
        <xsl:call-template name="foot" />
      </body>
    </html>
  </xsl:template>
  
</xsl:stylesheet>
