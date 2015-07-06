<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml"
              doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
              doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
              omit-xml-declaration="no"
              indent="yes" />  

  <xsl:template name="stylesheets">
    <xsl:copy-of select="files/stylesheets/*"/>
  </xsl:template>

  <xsl:template name="scripts">
    <xsl:copy-of select="files/scripts/*"/>
  </xsl:template>
  
  <xsl:template name="html">
    <html>
      <xsl:comment>This file was auto-generated. Please do not edit it by hand as changes will be overwritten.</xsl:comment>
      <head>
        <title>Unit Test: <xsl:value-of select="$pagename"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <xsl:call-template name="stylesheets" />
        <script type="text/javascript" charset="utf-8">
        	<xsl:comment>
            var eventResults = {};
            var originalElement = window.Element;
            </xsl:comment>
        </script>
      </head>
      <body>
        <h1>Unit Test: <xsl:value-of select="$pagename"/></h1>
        <noscript>
          <p>
            <code>
              This page requires JavaScript. Please enable it or use a browser
              which is capable of JavaScript, such as <a
              href="http://firefox.com/">Mozilla Firefox</a>.
            </code>
          </p>
        </noscript>
        <div id="testlog"></div>
        
        <xsl:call-template name="body"/>
        
        <xsl:call-template name="scripts" />
      </body>
    </html>
    <script type="text/javascript" charset="utf-8">
       	<xsl:comment>
        eventResults.endOfDocument = true;
        </xsl:comment>
    </script>
  </xsl:template>
  
</xsl:stylesheet>