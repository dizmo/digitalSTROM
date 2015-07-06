<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:import href="../../../../Arteria-Base/src/main/xslt/common.xsl"></xsl:import>
  <xsl:variable name="pagename">digitalSTROM - Button</xsl:variable>
  <xsl:template name="scripts">
    <xsl:copy-of select="files/scripts/*[position()&lt;last()]"/>
    <xsl:copy-of select="files/scripts/*[position()=last()]"/>
  </xsl:template>

    <xsl:template match="/">
        <xsl:call-template name="html" />
    </xsl:template>

    <xsl:template name="body">
        <div class="front">
			<div class="top" style="width:236px;"></div>
			<div id="frontcontent">Button Front</div>
			<div class="bottom" style="width:236px;"></div>
        </div>
        <div class="back activities_back" style="display:none;">
        	<div class="backside_container" style="width:216px;height:244px;">
		        <input type="button" value="Finish" class="finish-btn" onclick="showFront();"></input>
				<div id="backcontent">Button Back</div>
			</div>
        </div>
        <div style="clear:both"></div>
        <script type="text/javascript" src="localizedStringsBla.js" charset="utf-8"></script>
    </xsl:template>

</xsl:stylesheet>
