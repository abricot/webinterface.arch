angular.module('templates.abricot', ['template/flipper/flipper.tpl.html', 'template/rating/rating.tpl.html', 'template/seekbar/seekbar.tpl.html', 'template/spinner/spinner.tpl.html', 'template/streamdetails/streamdetails.tpl.html', 'template/timepicker/timepicker.html']);

angular.module("template/flipper/flipper.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/flipper/flipper.tpl.html",
    "<div class=\"flipper\" ng-transclude ng-class=\"{flipped : flipped}\">\n" +
    "</div>");
}]);

angular.module("template/rating/rating.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.tpl.html",
    "<div class=\"md-circle rating\">\n" +
    "    <div class=\"value\">{{roundedValue}}</div>\n" +
    "    <i class=\"star fa fa-star left\"></i>\n" +
    "    <i class=\"star fa fa-star middle\"></i>\n" +
    "    <i class=\"star fa fa-star right\"></i>\n" +
    "</div>");
}]);

angular.module("template/seekbar/seekbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/seekbar/seekbar.tpl.html",
    "<div role=\"slider\" ng-class=\"{horizontal : !seekbarIsVertical, vertical : seekbarIsVertical}\">\n" +
    "    <progress class=\"progress\" value=\"0\" max=\"{{seekbarMax}}\"></progress>\n" +
    "    <button class=\"thumb\"></button>\n" +
    "</div>");
}]);

angular.module("template/spinner/spinner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/spinner/spinner.tpl.html",
    "<div class=\"spinner-wrapper\">\n" +
    "    <div class=\"spinner\">\n" +
    "        <div class=\"bounce\"></div>\n" +
    "        <div class=\"bounce\"></div>\n" +
    "        <div class=\"bounce\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/streamdetails/streamdetails.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/streamdetails/streamdetails.tpl.html",
    "<div class=\"stream details\">\n" +
    "    <div class=\"detail video mode\" ng-show=\"hasVideo()\">\n" +
    "        <i class=\"icon-film\"></i>\n" +
    "        {{getVideoMode()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio channels\" ng-show=\"hasAudio()\">\n" +
    "        <i class=\"icon-volume-up\"></i>\n" +
    "        {{getAudioChannels()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio lang\" ng-show=\"hasAudio()\">\n" +
    "        <i class=\"icon-comments-alt\"></i>\n" +
    "        {{getAudioLanguage()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio subtitle\" ng-show=\"hasSubtitle()\">\n" +
    "        <i class=\"icon-file-text-alt\"></i>\n" +
    "        {{getSubtitles()}}\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/timepicker/timepicker.html",
    "<table>\n" +
    "    <tbody>\n" +
    "        <tr>\n" +
    "          <td><a ng-click=\"incrementHours()\" class=\"btn-link\"><span class=\"icon-chevron-up\"></span></a></td>\n" +
    "          <td>&nbsp;</td>\n" +
    "          <td><a ng-click=\"incrementMinutes()\" class=\"btn-link\"><span class=\"icon-chevron-up\"></span></a></td>\n" +
    "          <td ng-show=\"showMeridian\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "                <input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\"/>\n" +
    "            </td>\n" +
    "            <td>:</td>\n" +
    "            <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "                <input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\"/>\n" +
    "            </td>\n" +
    "            <td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">\n" +
    "                {{meridian}}\n" +
    "            </button></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td><a ng-click=\"decrementHours()\" class=\"btn-link\"><span class=\"icon-chevron-down\"></span></a></td>\n" +
    "            <td>&nbsp;</td>\n" +
    "            <td><a ng-click=\"decrementMinutes()\" class=\"btn-link\"><span class=\"icon-chevron-down\"></span></a></td>\n" +
    "            <td ng-show=\"showMeridian\"></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);
