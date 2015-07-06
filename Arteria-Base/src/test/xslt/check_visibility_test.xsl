<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:variable name="pagename"></xsl:variable>

  <xsl:include href="../../../../Arteria-Base/src/test/xslt/test.xsl"></xsl:include>

  <xsl:template match="/">
    <xsl:call-template name="html"/>
  </xsl:template>

  <xsl:template name="body">
    <div id="content">
        <div id="visible_outer" style="border: 1px solid blue">
            <div><div id="visible_inner">Visible</div></div>
        </div>

        <div id="invisible_outer" style="border: 1px solid green; overflow: hidden; width: 100px; height: 30px;">
            <div style="border: 1px solid yellow; width: 100px; height: 50px">fat element</div>
            <div style="border: 1px solid red; left: 300px; top: 100px">
                <div id="invisible_inner">Invisible</div>
            </div>
        </div>
    </div>
  </xsl:template>

</xsl:stylesheet>
