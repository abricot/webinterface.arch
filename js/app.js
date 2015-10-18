angular.module('templates.app', ['modules/common/navigation.tpl.html', 'modules/donation/form.tpl.html', 'modules/movie/details.tpl.html', 'modules/movie/list.tpl.html', 'modules/movie/movies.tpl.html', 'modules/music/albums.tpl.html', 'modules/music/artist.albums.tpl.html', 'modules/music/artists.tpl.html', 'modules/music/musics.tpl.html', 'modules/music/songs.tpl.html', 'modules/now/playing.tpl.html', 'modules/now/playlist.tpl.html', 'modules/remote/remote.tpl.html', 'modules/search/list.tpl.html', 'modules/settings/wizard.tpl.html', 'modules/tvshow/calendar.tpl.html', 'modules/tvshow/details.tpl.html', 'modules/tvshow/episodes.tpl.html', 'modules/tvshow/list.tpl.html', 'modules/tvshow/shows.tpl.html', 'template/actions/actions.tpl.html', 'template/comments/comments.tpl.html', 'template/fanarts/fanarts.tpl.html', 'template/nosource/nosource.tpl.html', 'template/stats/stats.tpl.html']);

angular.module("modules/common/navigation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/common/navigation.tpl.html",
    "<nav class=\"row\">\n" +
    "    <form class=\"span3 clearfix search\" ng-submit=\"search()\" ng-class=\"{open : isOpen}\">\n" +
    "        <div class=\"btn\" ng-click=\"open()\">\n" +
    "            <i class=\"fa fa-search\"></i>\n" +
    "        </div>\n" +
    "        <input type=\"text\" placeholder=\"Search movies and shows\" ng-model=\"query\"/>\n" +
    "    </form>\n" +
    "    <div class=\"clearfix tabs span6\">\n" +
    "        <a href=\"#{{item.hash}}\" ng-repeat=\"item in medias\" ng-class=\"{selected : isCurrent(item.matchRegExp)}\"\n" +
    "            class=\"tab span{{12/medias.length}}\">\n" +
    "            <div class=\"label\">{{item.label}}</div>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"donate\"> \n" +
    "        <button class=\"recommend\" ng-click=\"showSupport()\">\n" +
    "            <i class=\"fa fa-paypal\"></i>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"status\" ng-class=\"{connected : connected, disconnected : !connected}\">\n" +
    "        <i class=\"fa\" ng-class=\"{'fa-check' : connected, 'fa-times' : !connected}\"></i>\n" +
    "    </div>\n" +
    "</nav>");
}]);

angular.module("modules/donation/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/donation/form.tpl.html",
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser donation\" \n" +
    "      action=\"https://www.paypal.com/cgi-bin/webscr\"\n" +
    "      method=\"post\" ng-show=\"isSupportVisible\" target=\"_blank\"\n" +
    "      ng-submit=\"hideSupport()\">\n" +
    "    <div class=\"content\">\n" +
    "        <img class=\"arch\" src=\"../img/icons/awe-512.png\"/>\n" +
    "        <i class=\"fa fa-times\" ng-click=\"hideSupport()\"></i>\n" +
    "        <div class=\"body\">\n" +
    "            <input type=\"hidden\" name=\"business\" value=\"nicolas.abric@gmail.com\"/>\n" +
    "            <input type=\"hidden\" name=\"cmd\" value=\"_xclick\"/>\n" +
    "            <input type=\"hidden\" name=\"item_number\" value=\"DONATE\"/>\n" +
    "            <input type=\"hidden\" name=\"item_name\" value=\"One time donation\"/>\n" +
    "            <header>\n" +
    "                One time donation\n" +
    "            </header>\n" +
    "            <p> \n" +
    "                You are enjoying Arch and want to show us your support? Please consider making a donation.\n" +
    "            </p>\n" +
    "            <div class=\"input-wrapper\">\n" +
    "                <i class=\"fa fa-gift\"></i>\n" +
    "                <input type=\"number\" maxlength=\"30\" name=\"amount\" size=\"10\"\n" +
    "                       value=\"5\"/>\n" +
    "            </div>\n" +
    "            <div class=\"input-wrapper\">\n" +
    "                <i class=\"fa\" ng-class=\"{\n" +
    "                    'fa-eur':donation.currency.value === 'EUR',\n" +
    "                    'fa-gbp':donation.currency.value === 'GBP',\n" +
    "                    'fa-jpy':donation.currency.value === 'JPY',\n" +
    "                    'fa-dollar':donation.currency.value === 'USD' || donation.currency.value === 'CAD' || donation.currency.value === 'AUD'\n" +
    "                }\"></i>\n" +
    "                <input type=\"text\" ng-model=\"donation.currency.label\" readonly=\"true\"/>\n" +
    "                <select name=\"currency_code\" ng-options=\"currency.label for currency in donation.currencies track by currency.value\" ng-model=\"donation.currency\"></select>\n" +
    "            </div>\n" +
    "            \n" +
    "            <button class=\"recommend\" type=\"submit\">\n" +
    "                <i class=\"fa fa-paypal\"></i> Donate\n" +
    "            </button>\n" +
    "            <p style=\"padding:2rem 0 0 0;\">\n" +
    "                <i class=\"fa fa-info-circle\"></i>\n" +
    "                Your donation will solely be used to maintain and improve Arch. \n" +
    "                We remind you that features can be requested at any time on the <a href=\"https://github.com/abricot/webinterface.arch/issues\" traget=\"_blank\">Arch github</a>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/movie/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/details.tpl.html",
    "<div ng-switch on=\"loading\" class=\"movie detail fill-height\" ng-class=\"{loading : loading}\">\n" +
    "    <div ng-switch-when=\"true\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    <div ng-switch-when=\"false\">\n" +
    "        <div class=\"experimental row\" ng-show=\"!isExternalAddonAvailable && isUsingExternalAddon()\">\n" +
    "            <div class=\"offset2 span8\">\n" +
    "                <i class=\"fa fa-flask\"></i>\n" +
    "                {{host.videoAddon}} needed to preview discoverable content.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row wrapper\">\n" +
    "            <tmdb-fanarts fanarts=\"fanarts\" delay=\"10000\" primary=\"getImage(movie.fanart)\"></tmdb-fanarts>\n" +
    "            <div class=\"actions\" ng-if=\"hasAdditionalInfo()\">\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"play(movie)\" ng-show=\"!player.active\">\n" +
    "                    <i class=\"fa fa-play\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"queue(movie)\" ng-show=\"player.active && !isCurrentlyPlaying\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"xbmc.togglePlay()\" ng-show=\"player.active && isCurrentlyPlaying\">\n" +
    "                    <i class=\"fa fa-play\" ng-show=\"!player.speed\"></i>\n" +
    "                    <i class=\"fa fa-pause\" ng-show=\"player.speed\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"actions\" ng-if=\"!hasAdditionalInfo()\">\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"play(movie)\">\n" +
    "                    <i class=\"fa fa-play\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"title\">\n" +
    "                <h1>{{movie.title}}</h1>\n" +
    "                <h2>{{movie.tagline}}</h2>\n" +
    "            </div>\n" +
    "            <trakt-stats stats=\"stats\"></trakt-stats>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\" poster\" image image-source=\"getImage(movie.thumbnail || movie.poster, 'w185')\"/>\n" +
    "                    <div class=\"preview\"  ng-click=\"xbmc.open({'file': movie.trailer})\">\n" +
    "                        <i class=\"fa fa-film\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{movie.title}}\n" +
    "                        <seekbar seekbar-value=\"movie.resume.position || 0\" seekbar-max=\"movie.resume.total || 100\"\n" +
    "                                 seekbar-read-only=\"true\" class=\"progress-wrapper\"\n" +
    "                                 ng-if=\"hasAdditionalInfo()\">\n" +
    "                        </seekbar>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-clock-o\"></i>\n" +
    "                            Runtime\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.runtime | time | date:'HH:mm'}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-star\"></i>\n" +
    "                            Rating\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.rating| number : 1}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"genre-{{movie.genre[0].toLowerCase()}}\"></i>\n" +
    "                            Genre\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.genre[0]}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-calendar\"></i>\n" +
    "                            Released\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.year}}</div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div ng-if=\"hasAdditionalInfo()\">\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"play(movie)\" ng-show=\"!player.active\">\n" +
    "                        <i class=\"fa fa-play\"></i> Play\n" +
    "                    </button>\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"queue(movie)\" ng-show=\"player.active && !isCurrentlyPlaying\">\n" +
    "                        <i class=\"fa fa-plus\"></i> Queue\n" +
    "                    </button>\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"xbmc.togglePlay()\" ng-show=\"player.active && isCurrentlyPlaying\">\n" +
    "                        <i class=\"fa fa-play\" ng-show=\"!player.speed\"></i>\n" +
    "                        <i class=\"fa fa-pause\" ng-show=\"player.speed\"></i>\n" +
    "                        <span ng-show=\"!player.speed\">Resume</span>\n" +
    "                        <span ng-show=\"player.speed\">Pause</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!hasAdditionalInfo()\">\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"play(movie)\">\n" +
    "                        <i class=\"fa fa-play\"></i> Play\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content\">\n" +
    "                <div class=\"details-section row\">\n" +
    "                    <div class=\"span9\">\n" +
    "                        <h1>Synopsis</h1>\n" +
    "                        <p class=\"plot\">{{movie.plot}}</p>\n" +
    "                    </div>\n" +
    "                    <trakt-actions class=\"span3\" media-type=\"'movies'\" imdb=\"movie.imdbnumber\">\n" +
    "                    </trakt-actions>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\">\n" +
    "                    <h1>\n" +
    "                        Actors\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"seeMoreActors=true;\" class=\"more\" ng-class=\"{hidden : seeMoreActors}\">\n" +
    "                            See more\n" +
    "                        </a>\n" +
    "                    </h1>\n" +
    "                    <ul class=\"actors\" ng-class=\"{collapsed : !seeMoreActors}\">\n" +
    "                        <li class=\"actor\" ng-repeat=\"actor in getActors()\">\n" +
    "                            <img class=\"poster\" image image-source=\"getImage(actor.thumbnail)\"/>\n" +
    "\n" +
    "                            <div class=\"name\">{{actor.name}}</div>\n" +
    "                            <div class=\"role\">{{actor.role}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\">\n" +
    "                    <h1>Credits</h1>\n" +
    "                    <ul>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Directors</b>\n" +
    "                            <div class=\"span9\">{{movie.director.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Writers</b>\n" +
    "                            <div class=\"span9\">{{movie.writer.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Studio</b>\n" +
    "                            <div class=\"span9\">{{movie.studio.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"details-section\" ng-if=\"similars.length\">\n" +
    "                    <h1>Similars</h1>\n" +
    "                    <ul class=\"similars collapsed\">\n" +
    "                        <li class=\"similar\" ng-repeat=\"similar in similars\">\n" +
    "                            <a href=\"#/movies/tmdb/{{similar.id}}\">\n" +
    "                                <div class=\"poster\" image\n" +
    "                                     image-source=\"similar.poster | tmdbImage:'w185' | fallback:'img/icons/awe-512.png'\">\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                            <div class=\"title\">{{similar.title}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"details-section\" ng-if=\"hasAdditionalInfo()\">\n" +
    "                    <h1>Additional information</h1>\n" +
    "                    <ul>\n" +
    "                        <li class=\"row info\">\n" +
    "                            <b class=\"span3\">Video</b>\n" +
    "                            <div class=\"span9\">{{getVideoDefinition()}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row info\">\n" +
    "                            <b class=\"span3\">Audio languages</b>\n" +
    "                            <div class=\"span9\">{{getAudio()}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row info\" ng-show=\"movie.mpaa !==''\">\n" +
    "                            <b class=\"span3\">MPAA</b>\n" +
    "                            <div class=\"span9\">{{movie.mpaa}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\" ng-if=\"comments.length\">\n" +
    "                    <h1>Popular comments</h1>\n" +
    "                    <trakt-comments comments=\"comments\"></trakt-comments>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/movie/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/list.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'movies'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\" scroll-threshold=\"200\">\n" +
    "        <li class=\"card movie repeat-animation\" ng-repeat-start=\"movie in movies\">\n" +
    "            <a href=\"{{getMoviesPath(movie)}}\">\n" +
    "                <div class=\"poster\" image image-source=\"getPoster(movie)\">\n" +
    "                    <flipper ng-show=\"hasControls()\">\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"movie.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                                <i class=\"fa fa-play\" ng-click=\"helper.local.movies.play(movie); $event.preventDefault();\"\n" +
    "                                   ng-show=\"!player.active\"></i>\n" +
    "                                <i class=\"fa fa-plus\" ng-click=\"queue(movie); $event.preventDefault();\"\n" +
    "                                   ng-show=\"player.active\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"rating-wrapper\" ng-show=\"!hasControls()\">\n" +
    "                        <div rating rating-value=\"movie.rating\" rating-max=\"10\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"playcount\" ng-show=\"movie.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{movie.label || movie.title}}</h3>\n" +
    "                    <h4>{{movie.year}}</h4>\n" +
    "                    <p class=\"clock\" ng-if=\"movie.runtime\">\n" +
    "                        {{movie.runtime | time | date:'HH:mm'}}\n" +
    "                    </p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"movie.resume.position\" seekbar-max=\"movie.resume.total\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                        <div class=\"controls\">\n" +
    "                            <i class=\"fa\" ng-class=\"{'fa-eye':!movie.playcount, 'fa-eye-slash':movie.playcount}\"\n" +
    "                               ng-click=\"toggleWatched(movie); $event.preventDefault();\"\n" +
    "                              ></i>\n" +
    "                            <i class=\"fa fa-trash\"\n" +
    "                               ng-click=\"remove($index, movie); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"card movie\" ng-repeat-end ng-if=\"$index===supportIndex\" ng-click=\"showSupport();\">\n" +
    "            <a href=\"javascript:void:0;\">\n" +
    "                <div class=\"poster\" image image-source=\"'img/backgrounds/support.png'\">\n" +
    "                    <img src=\"../img/icons/loading.png\" width=\"75%\" class=\"arch\"/>\n" +
    "                    <div class=\"rating-wrapper\">\n" +
    "                        <div class=\"md-circle rating\">\n" +
    "                            <i class=\"fa fa-paypal\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                 <div class=\"description\">\n" +
    "                    <h3>Enjoying Arch ?</h3>\n" +
    "                    <h4>Support us!</h4>\n" +
    "                    <p class=\"clock\" ng-show=\"hasControls()\">&nbsp;</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"0\" seekbar-max=\"1\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/movie/movies.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/movies.tpl.html",
    "<div class=\"movies fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/popular\" ng-class=\"{selected :isSelected('movies.popular')}\">Discover</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/recents\" ng-class=\"{selected :isSelected('movies.recents')}\">Recently added</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/all\"  ng-class=\"{selected :isSelected('movies.all')}\">All movies</a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('VideoLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan video library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/albums.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/albums.tpl.html",
    "<div class=\"fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"cards albums\">\n" +
    "        <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "            <li class=\"row album card repeat-animation\" ng-repeat=\"album in albums\">\n" +
    "                <a href=\"#/musics/songs/albumid/{{album.albumid}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{album.label}}</h3>\n" +
    "                        <p>{{album.artist.join(', ')}}</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modules/music/artist.albums.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/artist.albums.tpl.html",
    "<div class=\"fill-height songs-wrapper detail\">\n" +
    "    <div class=\"kodi\" ng-hide=\"songs.length\"></div>\n" +
    "        <div class=\"wrapper row\">\n" +
    "            <div class=\"fanart\" image image-source=\"artist.fanart | asset:host\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\"poster\" image image-source=\"artist.thumbnail | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"/>\n" +
    "                </div>\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{artist.artist}}\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">Genre</div>\n" +
    "                        <div class=\"span6 value\">\n" +
    "                            {{artist.genre.join(', ')}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">Active</div>\n" +
    "                        <div class=\"span6 value\">\n" +
    "                            <span ng-repeat=\"active in artist.yearsactive\">{{active}}</span>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content songs\">\n" +
    "                <div class=\"album repeat-animation\" ng-repeat=\"album in albums\">\n" +
    "                    <div class=\"detail\">\n" +
    "                        <div class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"\n" +
    "                             >\n" +
    "                        </div>\n" +
    "                        <h1>{{album.label}}</h1>\n" +
    "                        <h3>{{album.year}}</h3>\n" +
    "                        <div class=\"md-action md-action-primary\"\n" +
    "                             ng-click=\"xbmc.open({albumid : album.albumid})\">\n" +
    "                            <i class=\"fa fa-play\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <ul data-type=\"list\">\n" +
    "                        <li class=\"row song\" ng-repeat=\"song in songs | filter:isPartOf(album) | orderBy:song.trac\"\n" +
    "                          ng-click=\"xbmc.open({songid : song.songid})\">\n" +
    "                            <div class=\"span4 track\">\n" +
    "                                <span class=\"thumbnail\" image image-source=\"song.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                                    <i class=\"fa fa-play\"></i>\n" +
    "                                </span>\n" +
    "                                {{song.label}}\n" +
    "                                <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(song.songid)\"/>\n" +
    "                            </div>\n" +
    "                            <div class=\"span3\">{{song.album}}</div>\n" +
    "                            <div class=\"span3\">{{song.artist.join(', ')}}</div>\n" +
    "                            <div class=\"span1 duration\">{{song.duration | time | date :'mm:ss'}}</div>\n" +
    "                            <div class=\"span1 more\">\n" +
    "                                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li ng-click=\"xbmc.queue({'songid':song.songid});$event.stopPropagation();\">\n" +
    "                                        <i class=\"fa fa-plus\"></i>\n" +
    "                                        Queue\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div ng-show=\"!albums.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/artists.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/artists.tpl.html",
    "<div class=\"fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"cards artists\">\n" +
    "        <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "            <li class=\"row card artist repeat-animation\" ng-repeat=\"artist in artists\">\n" +
    "                <a href=\"#/musics/albums/artistid/{{artist.artistid}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"artist.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{artist.label}}</h3>\n" +
    "                        <p>{{artist.genre.join(', ')}}&nbsp;</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("modules/music/musics.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/musics.tpl.html",
    "<div class=\"music fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/albums/all\" ng-class=\"{selected : isSelected('music.*albums$')}\">Albums</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/artists/all\" ng-class=\"{selected : isSelected('music.*artists$')}\">Artists</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/songs/all\" ng-class=\"{selected : isSelected('music.*songs')}\">Songs</a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('AudioLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan audio library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/songs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/songs.tpl.html",
    "<div class=\"fill-height songs-wrapper detail\" lr-infinite-scroll=\"loadMore\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"wrapper row\">\n" +
    "        <div class=\"fanart\" image image-source=\"album.fanart | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"></div>\n" +
    "        <div class=\"actions\">\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "               ng-click=\"xbmc.open({'file' : undefined})\"\n" +
    "               ng-show=\"!album\">\n" +
    "                <i class=\"fa fa-random\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "                 ng-click=\"xbmc.queue({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && player.active\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "                 ng-click=\"xbmc.open({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && !player.active\">\n" +
    "                <i class=\"fa fa-play\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"description row\">\n" +
    "        <div class=\"offset1 span2 sidebar\">\n" +
    "            <div class=\"poster-wrapper\">\n" +
    "                <img class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\"/>\n" +
    "            </div>\n" +
    "            <ul class=\"nav sections\">\n" +
    "                <li style=\"text-align: center\">\n" +
    "                    {{album.label | fallback:'Library'}}\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Artist</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.displayartist}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Genre</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.genre.join(', ')}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Year</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.year}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"!album\">\n" +
    "                    <div class=\"span6 label\"># Songs</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{total}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <button class=\"recommend\" class=\"md-action md-action-primary\"\n" +
    "                    ng-click=\"xbmc.open({'file' : undefined})\"\n" +
    "                    ng-show=\"!album\">\n" +
    "                <i class=\"fa fa-random\"></i> Shuffle\n" +
    "            </button>\n" +
    "            <button class=\"recommend\"\n" +
    "                 ng-click=\"xbmc.queue({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && player.active\">\n" +
    "                <i class=\"fa fa-plus\"></i> Queue\n" +
    "            </button>\n" +
    "            <button class=\"recommend\"\n" +
    "                 ng-click=\"xbmc.open({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && !player.active\">\n" +
    "                <i class=\"fa fa-play\"></i> Play\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"span7 content\">\n" +
    "            <ul data-type=\"list\">\n" +
    "                <li class=\"row song repeat-animation\" ng-repeat=\"song in songs\"\n" +
    "                    ng-click=\"xbmc.open({songid : song.songid})\">\n" +
    "                    <div class=\"span4 track\">\n" +
    "                        <span class=\"thumbnail\" image image-source=\"song.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                            <i class=\"fa fa-play\"></i>\n" +
    "                        </span>\n" +
    "                        {{song.label}}\n" +
    "                        <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(song.songid)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"span3\">{{song.album || '&nbsp;'}}</div>\n" +
    "                    <div class=\"span3\">{{song.artist.join(', ') || '&nbsp;'}}</div>\n" +
    "                    <div class=\"span1 duration\">{{song.duration | time | date :'mm:ss'}}</div>\n" +
    "                    <div class=\"span1 more\">\n" +
    "                        <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                        <ul class=\"dropdown-menu\">\n" +
    "                            <li ng-click=\"xbmc.queue({'songid':song.songid});$event.stopPropagation();\">\n" +
    "                                <i class=\"fa fa-plus\"></i>\n" +
    "                                Queue\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/now/playing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/now/playing.tpl.html",
    "<div class=\"row buttons\">\n" +
    "    <div class=\"actions-wrapper row\">\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action\" ng-click=\"xbmc.previous()\" >\n" +
    "                <i class=\"fa fa-fast-backward\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action primary\" ng-click=\"xbmc.togglePlay()\">\n" +
    "                <i class=\"fa\" ng-class=\"{'fa-play' : !player.speed, 'fa-pause' : player.speed}\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action\" ng-click=\"xbmc.next()\"  >\n" +
    "                <i class=\"fa fa-fast-forward\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"player-wrapper \" ng-switch on=\"player.active\">\n" +
    "        <div ng-switch-when=\"false\" class=\"empty\">\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"true\">\n" +
    "            <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\"\n" +
    "            on-seekbar-changed=\"onSeekbarChanged(newValue)\"\n" +
    "            class=\"seekbar\"></seekbar>\n" +
    "            <div class=\"player row\">\n" +
    "                <a href=\"#{{getHashForItem()}}\" class=\"poster-wrapper\" >\n" +
    "                    <div class=\"poster\" image image-source=\"player.item.thumbnail | asset:host | fallback:'img/icons/awe-512.png'\"\n" +
    "                         ng-class=\"{show : player.item.type === 'episode'}\"></div>\n" +
    "                </a>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"label times\" ng-click=\"toggleTimePicker()\">\n" +
    "                    {{player.seek.time | time | date:'HH:mm:ss'}}/\n" +
    "                    {{player.seek.totaltime | time | date:'HH:mm:ss'}}\n" +
    "                    [-{{(player.seek.totaltime - player.seek.time)  | time | date:'HH:mm:ss'}}]\n" +
    "                </div>\n" +
    "                <div class=\"md-action stop\" ng-click=\"xbmc.stop()\">\n" +
    "                    <i class=\"fa fa-stop\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action more\">\n" +
    "                    <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li ng-click=\"xbmc.showOSD()\">OSD</li>\n" +
    "                        <li ng-click=\"toggleAudioStreams()\" ng-show=\"isTypeVideo()\">Switch audio</li>\n" +
    "                        <li ng-click=\"toggleSubtitles()\" ng-show=\"isTypeVideo()\">Switch subtitles</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"actions-wrapper\">\n" +
    "       <div class=\"span3\">\n" +
    "           <div class=\"md-action\" ng-click=\"xbmc.home()\" >\n" +
    "                <i class=\"fa fa-home\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action\"  ng-click=\"xbmc.open({'file' : undefined})\">\n" +
    "                <i class=\"fa fa-headphones\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action\">\n" +
    "                <i class=\"fa fa-volume-up\" ng-show=\"application.muted\" ng-click=\"xbmc.mute()\"></i>\n" +
    "                <i class=\"fa fa-volume-off\" ng-show=\"!application.muted\" ng-click=\"xbmc.mute()\"></i>\n" +
    "                <div class=\"volume-wrapper\">\n" +
    "                    <seekbar seekbar-value=\"application.volume\" seekbar-max=\"100\"\n" +
    "                    on-seekbar-changed=\"onVolumeChanged(newValue)\"\n" +
    "                    seekbar-orientation=\"vertical\"\n" +
    "                    class=\"volume seekbar\"></seekbar>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action more\">\n" +
    "                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                <div class=\"remote-menu\">\n" +
    "                    <div class=\"buttons\" ng-if=\"view==='remote'\"\n" +
    "                        ng-include src=\"'modules/remote/remote.tpl.html'\"></div>\n" +
    "                    <div class=\"buttons\" ng-if=\"view==='playlist'\"\n" +
    "                        ng-include src=\"'modules/now/playlist.tpl.html'\"></div>\n" +
    "                    <div class=\"tabs row\">\n" +
    "                        <a ng-click=\"view = 'remote'\" class=\"tab span6\" ng-class=\"{selected : view === 'remote'}\">Remote</a>\n" +
    "                        <a ng-click=\"view = 'playlist'\" href=\"javascript:void(0);\" class=\"tab span6\" ng-class=\"{selected : view === 'playlist'}\">Queue</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showAudioSelect\">\n" +
    "    <div class=\"content\">\n" +
    "        <header> Audio Streams </header>\n" +
    "        <div class=\"body\">\n" +
    "            <label ng-repeat=\"audiostream in player.audiostreams\">\n" +
    "                <input type=\"radio\" ng-model=\"stream\" ng-value=\"audiostream.index\" name=\"audiostreams\"/>\n" +
    "                {{audiostream.name}} ( {{audiostream.language}})\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleAudioStreams()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateAudioStream()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showSubtitleSelect\">\n" +
    "    <div class=\"content\">\n" +
    "        <header> Subtitles </header>\n" +
    "        <div class=\"body\">\n" +
    "            <label>\n" +
    "                <input type=\"radio\" ng-model=\"sub\" value=\"off\" name=\"subtitles\"/>\n" +
    "                None\n" +
    "            </label>\n" +
    "            <label ng-repeat=\"subtitle in player.subtitles\">\n" +
    "                <input type=\"radio\" ng-model=\"sub\" ng-value=\"subtitle.index\" name=\"subtitles\"/>\n" +
    "                {{subtitle.name}} ({{subtitle.language}})\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleSubtitles()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateSubtitles()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showTimePicker\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>Select time </header>\n" +
    "        <div class=\"body\">\n" +
    "            <div class=\"time\">\n" +
    "                <div ng-model=\"seekTime\" class=\"picker\">\n" +
    "                    <timepicker hour-step=\"1\" minute-step=\"1\" show-meridian=\"false\"></timepicker>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button  ng-click=\"toggleTimePicker()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateSeekTime()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showKeyboard\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>Send text</header>\n" +
    "        <div class=\"body\">\n" +
    "            <textarea class=\"offset1 span10\" ng-model=\"textToSend\"\n" +
    "                          placeholder=\"Text to send\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleKeyboard()\"> Cancel </button>\n" +
    "            <button class=\"recommend\"   ng-click=\"onValidateText()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showShutdownOptions\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>System</header>\n" +
    "        <div class=\"body\">\n" +
    "            <button class=\"command\" ng-click=\"execCommand('shutdown')\">Power off</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('hibernate')\">Hibernate</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('suspend')\">Suspend</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('reboot')\">Reboot</button>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleShutdownOptions()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/now/playlist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/now/playlist.tpl.html",
    "<div class=\"now\">\n" +
    "    <div class=\"arts\">\n" +
    "        <div ng-switch on=\"player.active\">\n" +
    "            <div ng-switch-when=\"true\">\n" +
    "                <div class=\"banner\" image image-source=\"player.item.fanart | asset:host\"></div>\n" +
    "                <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\" seekbar-read-only=\"true\"></seekbar>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"xbmc.next()\">\n" +
    "                    <i class=\"fa fa-fast-forward\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-switch-when=\"false\">\n" +
    "                <div class=\"banner\"></div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"xbmc.next()\">\n" +
    "                    <i class=\"fa fa-fast-forward\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"playlist\">\n" +
    "        <ul data-type=\"list\" class=\"view\" ng-if=\"!loading && items.length\">\n" +
    "            <li class=\"row \" ng-repeat=\"item in items\"\n" +
    "                ng-click=\"goTo($index)\">\n" +
    "                <div class=\"span3 wrapper\">\n" +
    "                    <div class=\"md-circle poster\" image image-source=\"item.art | thumb | asset:host | fallback:'img/icons/awe-512.png'\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"span8\">\n" +
    "                    <p>{{item.label}}</p>\n" +
    "                    <p ng-show=\"item.duration\">{{item.duration | time | date :'mm:ss'}}</p>\n" +
    "                    <p ng-show=\"item.runtime\">{{item.runtime| time | date :'hh:mm:ss'}}</p>\n" +
    "                    <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(item.id)\"/>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <div ng-if=\"!loading &&!items.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "        <div ng-if=\"loading\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/remote/remote.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/remote/remote.tpl.html",
    "<div class=\"remote\">\n" +
    "    <div class=\"arts\">\n" +
    "        <div ng-switch on=\"player.active\">\n" +
    "            <div ng-switch-when=\"true\">\n" +
    "                <div class=\"banner\" image image-source=\"player.item.fanart | asset:host\"></div>\n" +
    "                <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\" seekbar-read-only=\"true\"></seekbar>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"toggleShutdownOptions()\">\n" +
    "                    <i class=\"fa fa-power-off\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-switch-when=\"false\">\n" +
    "                <div class=\"banner\"></div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"toggleShutdownOptions()\">\n" +
    "                    <i class=\"fa fa-power-off\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"buttons\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\"  ng-click=\"xbmc.info()\">\n" +
    "                    <i class=\"fa fa-info\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\"  ng-click=\"xbmc.up()\">\n" +
    "                    <i class=\"fa fa-chevron-up\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\"  ng-click=\"xbmc.contextmenu()\">\n" +
    "                    <i class=\"fa fa-list-ul\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.left()\">\n" +
    "                    <i class=\"fa fa-chevron-left\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action select\" ng-click=\"xbmc.select()\">\n" +
    "                    <i class=\"fa fa-circle\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.right()\">\n" +
    "                    <i class=\"fa fa-chevron-right\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\" ng-click=\"xbmc.back()\">\n" +
    "                    <i class=\"fa fa-mail-reply\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.down()\">\n" +
    "                    <i class=\"fa fa-chevron-down\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "               <div class=\"md-action\" ng-click=\"toggleKeyboard()\">\n" +
    "                    <i class=\"fa fa-keyboard-o\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/search/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/search/list.tpl.html",
    "<div class=\"search fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType=''\"\n" +
    "           ng-class=\"{selected : filter.mediaType==='' }\">\n" +
    "           All\n" +
    "        </a>\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType='movie'\"\n" +
    "           ng-class=\"{selected :  filter.mediaType==='movie'}\">\n" +
    "           Movies\n" +
    "        </a>\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType='tv'\"\n" +
    "           ng-class=\"{selected :  filter.mediaType==='tv'}\">\n" +
    "           TV shows\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <div class=\"cards fill-height\">\n" +
    "            <div class=\"kodi\" ng-hide=\"results.length\"></div>\n" +
    "            <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "                <li class=\"card result repeat-animation\" ng-repeat=\"result in results | filter:filter\">\n" +
    "                    <a href=\"{{getPath(result)}}\">\n" +
    "                        <div class=\"poster\" image image-source=\"result.poster | tmdbImage:'w500' | fallback:'img/icons/awe-512.png'\">\n" +
    "                            <div class=\"rating-wrapper\">\n" +
    "                                <div rating rating-value=\"result.rating\" rating-max=\"10\"></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"description\">\n" +
    "                            <h3>{{result.label || result.title || result.name}}</h3>\n" +
    "                            <h4>{{result.year || '-'}}</h4>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div ng-show=\"!result.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>s");
}]);

angular.module("modules/settings/wizard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/settings/wizard.tpl.html",
    "<form class=\"wizard row fill-height\" name=\"wizard\" >\n" +
    "    <div class=\"arts\">\n" +
    "        <div class=\"banner\"></div>\n" +
    "        <div class=\"md-action md-action-primary\" ng-click=\"save()\">\n" +
    "            <i class=\"fa fa-save\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"settings\">\n" +
    "      <div data-type=\"list\">\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-info-sign\"></i> General information</h1>\n" +
    "            <p class=\"host row\">\n" +
    "                <label class=\"span4\">Host IP</label>\n" +
    "                <input class=\"span5\" name=\"ip\" type=\"text\" placeholder=\"Ex : 192.16.0.1, hostname\" required=\"\" ng-model=\"host.ip\" tabindex=\"2\"/>\n" +
    "            </p>\n" +
    "            <p class=\"row httpport\">\n" +
    "                <label class=\"span4\">Webserver port</label>\n" +
    "                <input  class=\"span5\" type=\"text\" placeholder=\"Ex : 8080\" required=\"\" ng-model=\"host.httpPort\" tabindex=\"3\"/>\n" +
    "            </p>\n" +
    "            <p class=\"row wsport\">\n" +
    "                <label class=\"span4\">Api port</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : 9090\" required=\"\" ng-model=\"host.port\" tabindex=\"3\"/>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-globe\"></i> Discover</h1>\n" +
    "            <p>\n" +
    "               Discover functionnality relies on external video add-on to be able to play content. Sepcify below which add-on you want to use.\n" +
    "            </p>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\">External video add-on</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : plugin.video.youtube\" required=\"\" ng-model=\"host.videoAddon\" tabindex=\"4\"/>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-trakt\"></i> Trakt</h1>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\"> Auto scrobble</label>\n" +
    "                <span class=\"span5\">\n" +
    "                  <input type=\"checkbox\" ng-model=\"autoScrobble\"/>\n" +
    "                  <label>do not activate if trakt plugin is enabled</label>\n" +
    "                </span>\n" +
    "            </p>\n" +
    "            <div class=\"row trakt-status\" style=\"padding : .5rem 1rem;\">\n" +
    "                <div class=\"span4\">Authentication status</div>\n" +
    "                <div class=\"span5\" ng-if=\"authentication\">\n" +
    "                    Last authentication <b>{{ authentication.created_at | date : 'dd/MM/yyyy HH:mm'}}</b>\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"refreshToken()\">refresh</a>\n" +
    "                </div>\n" +
    "                <div class=\"span4\" ng-if=\"!authentication\">\n" +
    "                    Not yet authenticated.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\">Pin code from Trakt</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : 73F75D39\" ng-model=\"pin\" tabindex=\"4\"/>\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"row\" style=\"padding : .5rem 1rem;\">\n" +
    "                <div class=\"span4\">How do I get my PIN</div>\n" +
    "                <div class=\"span5 pin-instruction\">\n" +
    "                    Visit the following url\n" +
    "                    <a href=\"https://trakt.tv/pin/5615\" target=\"_blank\">https://trakt.tv/pin/5615</a>\n" +
    "                    <div class=\"separator-with-text\">or</div>\n" +
    "                    Scan the follwing QR code </br>\n" +
    "                    <img class=\"qr-code\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQAAAADcA+lXAAAD8klEQVR4nO2dQXKjQAxFkUkV2Xlu4NwE3wxzs3CT5AZhN1TF7pG+1EASu2YRnGGo3wvKAfulvVBJ+lLLu/TNtSu+uQgggAACCCCAAAIIuBcgybSe7Mar+NNeJP6D3hn0KS55nZbbAQEEEJABVaRQ7/m+PJqR/orLWeqkd+qkT+p468uyOyCAgM0AutFZ6Tqk9LvoSreaV5Eqm44tOMKH5XdAAAHbA5zlqdCA8Ghx4mn+oJMf2gEBBGwDoF5HndGj/9GKqJsa5Oknd0AAAf81AKnQyV7lfKg+qx2dJL0VbYR5yJkK+ZBcregrEEDAGgBZ5bNUCBfNmfLqxT1TlVoL87q5briir0AAAWsAyKwl4mXU7jp71lz00k4CRDV762m5HRBAwIYA6nCggYsUZXKlQUzImxeqjoU+PkIsv8MOCCCAAF/1xYrE1ZhQ6SvzaihUNe/zjyANY9mYAAKuA9RtIVhEdjVp63uLBfdWmaqtdAWV4xlpGBUMAgi4BogUq/fyrld0q9TaHciBTQiEXTQ0IU48MOkigIAvADili7qgZLbiXmcQiBfNOfcCQryQ/Uy8WHAHBBCwJYAlR+3omSyew50yeybzXmMH7qlkcx8BBFwBoF0Pr5AuWQhn8Rzs6OKJE0pXmjP1Y5i36A4IIGAjAMktsShU6aUTV/PUjlKW7UxWRze6vYtVXwIIuAEI7c5tBFXfvHb5tppQK+aeziaW8wwHAQTcCQDxr4jsKuRAL1SFkn4wk2xS/lhL10YAAdcBg7VWaECIpMt6MDS7OpqsjhpvAb2iSs9F7nMqrCvjtOQOCCBgE4DkuVQ0qKP0K3v3VVjwQ2i+9aovXBi7Awkg4BqgChsZLN+CRfVjC0Xhvsq19UFjPWsafKBnIoCAGwAIE+qZusiQYgpFE8Xg8ExudWpjIcKv6isQQMC/B0g+P9UgwouGiWcMWEJLbOly+hFHr3YfztOv5CsQQMBaAIPLDX50qowwLwSI5H4ItSzrR6K2TgABNwFmI63kqWJ+mRb80Ksf83XPxDCPAALuBZB8wMMPC0OvgA87WA/GIU3TyrwntzcFg33rBBDwFfBpqi2iwjzGAsEi1uBJ19FeM04kgIAbgPlQWlxMSS+tXxAnQUwgdE0jRHie9SWAgJuA2VDa8YCHNwZGZ4W32so42IJhHgEE/A3gjbW9x3NY7YMrGH5wfupQutcOCCBgOwAEdensvmo//tIAvJfXgTmFggACbgFmQ2mnnAnaA7R1/BrBtFr2IxFAwHXAfCgt1sx0oiyFARSYTOvjx5gzEUDAHQCfptpGQlVfPESMFMv71lHRevsM+PYOCCCAAAIIIIAAAghYFvAHGcp+35Z69Z0AAAAASUVORK5CYII=\"/>\n" +
    "                    <br />\n" +
    "                    Follow instruction on screen and authorize Arch. Enter your pin in the above textfield.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/tvshow/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/calendar.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"!dates.length || fetching\" ng-class=\"{fetching : fetching}\"></div>\n" +
    "    <div class=\"cal-summary detail\">\n" +
    "        <h1>\n" +
    "            <i class=\"previous\" ng-click=\"previousMonth()\">&#8592;</i>\n" +
    "            <i class=\"next\" ng-click=\"nextMonth()\">&#8594;</i>\n" +
    "            {{refDate.format('MMMM')}}\n" +
    "        </h1>\n" +
    "        <p ng-show=\"showsCount()\">\n" +
    "            <b>{{getEpisodesFor(refDate, 'month').length}}</b> episodes from <b>{{showsCount()}}</b> shows airing this month.\n" +
    "        </p>\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"(key, value) in shows\" class=\"repeat-animation\">\n" +
    "                <a href=\"#/tvshows/tmdb/{{value.ids.tmdb}}\">\n" +
    "                    <div class=\"banner\" image image-source=\"getBanner(value)\"></div>\n" +
    "                    <div class=\"counter\">{{value.hit}}</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"!showsCount()\">Oops! nothing here</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <ul data-type=\"list\" class=\"cal-grid\">\n" +
    "        <li ng-repeat=\"date in dates\" class=\"repeat-animation cal-day\" on-last-repeat>\n" +
    "            <header ng-class=\"{today : isToday(date), past: isPast(date), future: isFuture(date)}\">\n" +
    "                <div class=\"date\">{{date.format('D')}}</div>\n" +
    "                <div class=\"day\">{{date.format('ddd')}}</div>\n" +
    "                <div class=\"month\">{{date.format('MMM')}}</div>\n" +
    "            </header>\n" +
    "            <div ng-repeat=\"show in getEpisodesFor(date) as episodes\" class=\"card\">\n" +
    "                <a href=\"#/tvshows/tmdb/{{show.show.ids.tmdb}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"getPoster(show)\">\n" +
    "                        <flipper ng-if=\"!isFuture(date)\">\n" +
    "                            <div class=\"front\">\n" +
    "                                <div rating rating-value=\"show.episode.rating || show.show.rating\" rating-max=\"10\"></div>\n" +
    "                            </div>\n" +
    "                            <div class=\"back\">\n" +
    "                                <div class=\"md-circle rating\">\n" +
    "                                    <i class=\"fa fa-play\" ng-click=\"play(show); $event.preventDefault();\"></i>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </flipper>\n" +
    "                        <div class=\"rating-wrapper\" ng-if=\"isFuture(date)\">\n" +
    "                            <div rating rating-value=\"show.episode.rating || show.show.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <img src=\"https://cdn.rawgit.com/ccMatrix/StudioLogos/master/161x109_mono_png/{{show.show.network}}.png\" class=\"network\" onerror=\"this.src='img/icons/default-studio.png';\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{show.episode.number | episode:show.episode.season}} - {{show.episode.title || 'TBA'}}</h3>\n" +
    "                        <div>{{show.show.title}}</div>\n" +
    "\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div ng-if=\"!episodes.length\" class=\"support\">\n" +
    "                <img src=\"../img/backgrounds/support.png\" width=\"100%\"/>\n" +
    "                <h3>\n" +
    "                    Enjoying Arch ? Support us!\n" +
    "                    <button class=\"recommend\" ng-click=\"showSupport()\">\n" +
    "                        <i class=\"fa fa-paypal\"></i>Donate\n" +
    "                    </button>\n" +
    "                </h3>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/details.tpl.html",
    "<div ng-switch on=\"loading\" class=\"tvshow detail fill-height\" ng-class=\"{loading : loading}\">\n" +
    "    <div ng-switch-when=\"true\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    <div ng-switch-when=\"false\">\n" +
    "        <i class=\"fa fa-chevron-left previous\"\n" +
    "           ng-if=\"seasons.indexOf(season) > 0\"\n" +
    "           ng-click=\"previousSeason()\"></i>\n" +
    "        <i class=\"fa fa-chevron-right next\"\n" +
    "           ng-if=\"seasons.indexOf(season) < seasons.length-1\"\n" +
    "           ng-click=\"nextSeason()\"></i>\n" +
    "        <div class=\"experimental row\" ng-show=\"!isExternalAddonAvailable && isUsingExternalAddon()\">\n" +
    "            <div class=\"offset2 span8\">\n" +
    "                <i class=\"fa fa-flask\"></i>\n" +
    "                {{host.videoAddon}} needed to preview discoverable content.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row wrapper\">\n" +
    "            <tmdb-fanarts fanarts=\"fanarts\" delay=\"10000\" primary=\"show.fanart\"></tmdb-fanarts>\n" +
    "            <div class=\"title\">\n" +
    "                <h1 ng-if=\"season\">{{seasonName(season)}}</h1>\n" +
    "                <h2>{{show.title || show.name}}</h2>\n" +
    "            </div>\n" +
    "            <trakt-stats stats=\"stats\"></trakt-stats>\n" +
    "        </div>\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\" poster\" image image-source=\"getImage(season.thumbnail || season.poster || show.thumbnail, 'w500')\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{show.title || show.name}}\n" +
    "                        <seekbar seekbar-value=\"show.watchedepisodes\" seekbar-max=\"show.episode\"\n" +
    "                                 seekbar-read-only=\"true\" class=\"progress-wrapper\"\n" +
    "                                 ng-if=\"show.watchedepisodes\">\n" +
    "                        </seekbar>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-television\"></i>\n" +
    "                            Season\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{season.season}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-star\"></i>\n" +
    "                             Rating\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{show.rating| number : 1}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"genre-{{show.genre[0].toLowerCase()}}\"></i>\n" +
    "                            Genre\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\"> {{show.genre[0]}} </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-calendar\"></i>\n" +
    "                             Released\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{getYear(show, season)}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-trakt\"></i>\n" +
    "                             Watching\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{watching.length}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\" ng-show=\"show.watchedepisodes\">\n" +
    "                        <div class=\"span6 label\">Progress</div>\n" +
    "                        <div class=\"span6 value\">{{show.watchedepisodes}}/{{show.episode}}</div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content\">\n" +
    "                <div  class=\"details-section row\">\n" +
    "                    <div class=\"span9\">\n" +
    "                        <h1>Synopsis</h1>\n" +
    "                        <p >{{show.plot}}</p>\n" +
    "                    </div>\n" +
    "                    <trakt-actions class=\"span3\" media-type=\"'shows'\" slug=\"show.traktSlug\">\n" +
    "                    </trakt-actions>\n" +
    "                </div>\n" +
    "                <div  class=\"details-section\" ng-if=\"nextAiringEpisode\">\n" +
    "                    <h1>\n" +
    "                      <i class=\"fa fa-clock-o\"></i>\n" +
    "                      Next Episode\n" +
    "                    </h1>\n" +
    "                    <div class=\"row next-episode\">\n" +
    "                        <div class=\"thumbnail span4\" image image-source=\"nextAiringEpisode.thumbnail | tmdbImage:'w300' | fallback:'img/icons/awe-512.png'\">\n" +
    "                        </div>\n" +
    "                        <div class=\"span8\">\n" +
    "                            <p>\n" +
    "                                {{nextAiringEpisode.episode | episode:nextAiringEpisode.season}} -\n" +
    "                                {{nextAiringEpisode.title || nextAiringEpisode.name}} airs {{nextAiringEpisode.firstaired | date : 'fullDate'}}\n" +
    "                            </p>\n" +
    "                            <p>{{nextAiringEpisode.plot}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div  class=\"details-section\" ng-if=\"seasons.length\">\n" +
    "                    <h1>\n" +
    "                        <span class=\"season\">\n" +
    "                            <span class=\"md-circle fanart\" image image-source=\"getImage(season.thumbnail || season.poster, 'w500')\">\n" +
    "                            </span>\n" +
    "                            {{seasonName(season)}}\n" +
    "                        </span>\n" +
    "                        <i class=\"fa fa-chevron-right\"></i>\n" +
    "                        Episodes\n" +
    "                    </h1>\n" +
    "                </div>\n" +
    "                <ul data-type=\"list\">\n" +
    "                    <li class=\"row episode playable\" ng-repeat=\"episode in episodes\"\n" +
    "                        ng-click=\"play(episode)\">\n" +
    "                        <div class=\"thumbnail span4\" image image-source=\"getImage(episode.thumbnail, 'w300')\">\n" +
    "                            <div class=\"md-action md-action-primary\">\n" +
    "                                <i class=\"fa fa-play\"></i>\n" +
    "                            </div>\n" +
    "                            <div class=\"playcount\" ng-show=\"episode.playcount\">\n" +
    "                                 <i class=\"fa fa-check\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"span8\">\n" +
    "                            <h3>\n" +
    "                                <span class=\"se\">{{episode.episode | episode:episode.season}}</span>\n" +
    "                                {{episode.title || episode.name}}\n" +
    "                            </h3>\n" +
    "                            <div>\n" +
    "                                <span class=\"firstaired\" ng-if=\"episode.firstaired\">{{episode.firstaired}}</span>\n" +
    "                                <span class=\"runtime\" ng-if=\"episode.runtime\">{{episode.runtime | time | date:'HH:mm'}}</span>\n" +
    "                            </div>\n" +
    "                            <p>{{episode.plot}}</p>\n" +
    "                            <div class=\"more\" ng-show=\"hasControls()\">\n" +
    "                                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li ng-click=\"xbmc.queue({'episodeid' : episode.episodeid}); $event.stopPropagation();\"\n" +
    "                                        ng-show=\"player.active\">\n" +
    "                                        <i class=\"fa fa-plus\"></i>\n" +
    "                                        Queue\n" +
    "                                    </li>\n" +
    "                                    <li ng-click=\"toggleWatched(episode); $event.stopPropagation();\">\n" +
    "                                        <i class=\"fa\" ng-class=\"{'fa-eye':!episode.playcount, 'fa-eye-slash':episode.playcount}\"></i>\n" +
    "                                        Toggle watch\n" +
    "                                    </li>\n" +
    "                                    <li ng-click=\"remove($index, episode); $event.stopPropagation();\">\n" +
    "                                        <i class=\"fa fa-trash\"></i>\n" +
    "                                        Remove\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div ng-show=\"!episodes.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "                <div  class=\"details-section\" ng-if=\"comments.length\">\n" +
    "                    <h1>Popular comments</h1>\n" +
    "                    <trakt-comments comments=\"comments\"></trakt-comments>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/tvshow/episodes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/episodes.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'tvshows'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "        <li class=\"card tvshow repeat-animation\" ng-repeat=\"episode in episodes\">\n" +
    "            <a href=\"#/tvshows/{{episode.tvshowid}}\">\n" +
    "                <div class=\"poster\" image image-source=\"episode.art['tvshow.poster'] | asset:host | fallback:'img/icons/awe-512.png'\">\n" +
    "                    <flipper>\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"episode.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                                <i class=\"fa fa-play\" ng-click=\"helper.local.shows.play(episode); $event.preventDefault();\"\n" +
    "                                   ng-show=\"!player.active\"></i>\n" +
    "                                <i class=\"fa fa-plus\" ng-click=\"xbmc.queue({'episodeid' : episode.episodeid}); $event.preventDefault();\"\n" +
    "                                   ng-show=\"player.active\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"playcount\" ng-show=\"episode.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{episode.title}}</h3>\n" +
    "                    <p>Episode {{episode.episode}}</p>\n" +
    "                    <p class=\"clock\">\n" +
    "                        {{episode.runtime | time | date:'HH:mm'}}\n" +
    "                    </p>\n" +
    "                    <seekbar seekbar-value=\"episode.resume.position\" seekbar-max=\"episode.resume.total\"\n" +
    "                             seekbar-read-only=\"true\">\n" +
    "                    </seekbar>\n" +
    "                    <div class=\"controls\">\n" +
    "                        <i class=\"fa\" ng-class=\"{'fa-eye':!episode.playcount, 'fa-eye-slash':episode.playcount}\"\n" +
    "                           ng-click=\"toggleWatched(episode); $event.preventDefault();\"\n" +
    "                        ></i>\n" +
    "                        <i class=\"fa fa-trash\"\n" +
    "                           ng-click=\"remove($index, episode); $event.preventDefault();\"\n" +
    "                        ></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/list.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'tvshows'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "        <li class=\"card tvshow repeat-animation\" ng-repeat-start=\"show in tvshows\">\n" +
    "            <a href=\"{{getEpisodesPath(show)}}\">\n" +
    "                <div class=\"poster\" image image-source=\"getPoster(show)\">\n" +
    "                    <flipper ng-show=\"hasControls()\">\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"show.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                               <img class=\"studio\" image image-source=\"getStudio(show)\"\n" +
    "                                    onerror=\"this.src='img/icons/default-studio.png';\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"rating-wrapper\" ng-show=\"!hasControls()\">\n" +
    "                        <div rating rating-value=\"show.rating\" rating-max=\"10\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"playcount\" ng-show=\"show.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{show.title || show.name}}</h3>\n" +
    "                    <p>{{getExtra(show)}}</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <p class=\"clock\">&nbsp;</p>\n" +
    "                        <seekbar seekbar-value=\"show.watchedepisodes\" seekbar-max=\"show.episode\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                        <div class=\"controls\">\n" +
    "                            <i class=\"fa\" ng-class=\"{'fa-eye':!show.playcount, 'fa-eye-slash':show.playcount}\"\n" +
    "                               ng-click=\"toggleWatched(show); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                            <i class=\"fa fa-trash\"\n" +
    "                               ng-click=\"remove($index, show); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"card tvshow\" ng-repeat-end ng-if=\"$index===supportIndex\" ng-click=\"showSupport();\">\n" +
    "            <a href=\"javascript:void:0;\">\n" +
    "                <div class=\"poster\" image image-source=\"'img/backgrounds/support.png'\">\n" +
    "                    <img src=\"../img/icons/loading.png\" class=\"arch\" width=\"75%\"/>\n" +
    "                    <div class=\"rating-wrapper\">\n" +
    "                        <div class=\"md-circle rating\">\n" +
    "                            <i class=\"fa fa-paypal\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                 <div class=\"description\">\n" +
    "                    <h3>Enjoying Arch ?</h3>\n" +
    "                    <p>Support us!</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"0\" seekbar-max=\"1\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/shows.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/shows.tpl.html",
    "<div class=\"fill-height tvshows\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/popular\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.popular')}\">\n" +
    "           Discover\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/calendar\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.calendar')}\">\n" +
    "          <i class=\"fa fa-trakt\"></i>\n" +
    "          Calendar\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/recents\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.recents')}\">\n" +
    "           Recently added episodes\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/all\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.all')}\">\n" +
    "           All shows\n" +
    "        </a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('VideoLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan video library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("template/actions/actions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/actions/actions.tpl.html",
    "<div class=\"trakt-actions\">\n" +
    "    <i class=\"fa fa-trakt\" ng-show=\"loading\"></i>\n" +
    "    <div class=\"hidden\" ng-class=\"{hidden : loading}\">\n" +
    "        <div class=\"button history\" ng-class=\"{selected : historyMatch.length}\"\n" +
    "             ng-click=\"toggleHistory()\">\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-play-circle-o': !historyMatch.length, 'fa-play-circle': historyMatch.length}\"></i>\n" +
    "            <span ng-if=\"!historyMatch.length\">Add to history</span>\n" +
    "            <span ng-if=\"historyMatch.length\">Played</span>\n" +
    "            <small>{{historyMatch[0].last_watched_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.history\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"button collection\"  ng-class=\"{selected : collectionMatch.length}\"\n" +
    "             ng-click=\"toggleCollection()\">\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-bookmark-o': !collectionMatch.length, 'fa-bookmark': collectionMatch.length}\"></i>\n" +
    "            <span ng-if=\"!collectionMatch.length\">Add to collection</span>\n" +
    "            <span ng-if=\"collectionMatch.length\">Collected</span>\n" +
    "            <small>{{collectionMatch[0].collected_at || collectionMatch[0].last_collected_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.collection\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"button watchlist\"  ng-class=\"{selected : watchlistMatch.length}\"\n" +
    "             ng-click=\"toggleWatchlist()\">\n" +
    "            <i class=\"fa fa-align-left\"></i>\n" +
    "            <span ng-if=\"!watchlistMatch.length\">Add to watchlist</span>\n" +
    "            <span ng-if=\"watchlistMatch.length\">Listed</span>\n" +
    "            <small>{{watchlistMatch[0].listed_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.watchlist\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/comments/comments.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/comments/comments.tpl.html",
    "<div ng-repeat=\"comment in comments\" class=\"row comment-wrapper\" ng-if=\"comment.comment\">\n" +
    "    <div class=\"caret\"></div>\n" +
    "    <p class=\"comment\" ng-class=\"{spoiler : comment.spoiler, revealed: comment.revealed}\"\n" +
    "        ng-click=\"comment.revealed = true;\">\n" +
    "        {{comment.comment}}\n" +
    "    </p>\n" +
    "    <div class=\"pull-right posted-at\">\n" +
    "        Posted {{comment.created_at | date : 'MMMM d, yyyy HH:mm'}}\n" +
    "    </div>\n" +
    "    <div class=\"user\">\n" +
    "        <a href=\"https://trakt.tv/users/{{comment.user.username}}\" target=\"_blank\">\n" +
    "            <img class=\"md-circle\" image image-source=\"comment.user.images.avatar.full | fallback:'img/icons/trakt.png'\"/>\n" +
    "        </a>\n" +
    "        <div class=\"name\">{{comment.user.username}}</div>\n" +
    "    </div>\n" +
    "</div> ");
}]);

angular.module("template/fanarts/fanarts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/fanarts/fanarts.tpl.html",
    "<div class=\"fanarts\">\n" +
    "    <img image image-source=\"primary\"\n" +
    "         ng-if=\"!fanarts || !fanarts.length\"/>\n" +
    "    <img ng-repeat=\"fanart in fanarts\" image image-source=\"getImage(fanart.file_path)|filter:wideEnough\"\n" +
    "         ng-class=\"{fx : $index === index}\"/>\n" +
    "</div>");
}]);

angular.module("template/nosource/nosource.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/nosource/nosource.tpl.html",
    "<div class=\"no source\" style=\"background-image:url('{{getBackgroundImg()}}')\">\n" +
    "    <div class=\"message\">\n" +
    "        <div class=\"md-circle robot\">\n" +
    "            <i class=\"genre-family\"></i>\n" +
    "        </div>\n" +
    "        <h1>We looked everywhere</h1>\n" +
    "        <div>But it seems that you do not have any content yet.</div>\n" +
    "        <h2>What's next?</h2>\n" +
    "        <a href=\"{{getWikiPage()}}\" target=\"_blank\">Add a source</a>\n" +
    "        <div ng-if=\"hasPopular()\">\n" +
    "          <div class=\"separator-with-text\">or</div>\n" +
    "          <a href=\"#/{{source}}/popular\" >Discover something new</a>\n" +
    "        </div>\n" +
    "        <div class=\"genres\">\n" +
    "          <i class=\"genre-{{getIcon()}}\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/stats/stats.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/stats/stats.tpl.html",
    "<div class=\"stats row\">\n" +
    "    <div class=\"offset3 span7\">\n" +
    "        <i class=\"fa fa-trakt\"></i>\n" +
    "        <span>\n" +
    "            {{stats.votes | unit}}\n" +
    "            <small>votes</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.watchers | unit}}\n" +
    "            <small>watchers</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.plays | unit}}\n" +
    "            <small>plays</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.collected_episodes | unit}}\n" +
    "            <small>collected</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.lists | unit}}\n" +
    "            <small>lists</small>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>");
}]);
