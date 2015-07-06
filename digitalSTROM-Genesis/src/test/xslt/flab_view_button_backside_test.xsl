<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:variable name="pagename">flab.view.button.backside</xsl:variable>

  <xsl:include href="../../../../Arteria-Base/src/test/xslt/test.xsl"></xsl:include>

  <xsl:template match="/">
    <xsl:call-template name="html"/>
  </xsl:template>

  <xsl:template name="body">
	<div class="backside_container button_back" style="width:216px;height:216px;">
		<input type="button" value="Finish" class="finish-btn" onclick="showFront();"></input>
		<div id="backsidecontent"></div>
	</div>
  </xsl:template>

</xsl:stylesheet>
