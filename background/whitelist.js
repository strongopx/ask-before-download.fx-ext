
var mimeTypeWhiteListText = `
# Data interchange

application/atom+xml                  atom;
application/json                      json map topojson;
application/ld+json                   jsonld;
application/rss+xml                   rss;
application/vnd.geo+json              geojson;
application/xml                       rdf xml;


# JavaScript

# Normalize to standard type.
# https://tools.ietf.org/html/rfc4329#section-7.2
application/javascript                js;
text/javascript                       txt;


# Manifest files

application/manifest+json             webmanifest;
application/x-web-app-manifest+json   webapp;
text/cache-manifest appcache;

# Media files

image/bmp                             bmp;
image/gif                             gif;
image/jpeg                            jpeg jpg;
image/jxr                             jxr hdp wdp;
image/png                             png;
image/svg+xml                         svg svgz;
image/tiff                            tif tiff;
image/vnd.wap.wbmp                    wbmp;
image/webp                            webp;
image/x-jng jng;

# Serving '.ico' image files with a different media type
# prevents Internet Explorer from displaying then as images:
# https://github.com/h5bp/html5-boilerplate/commit/37b5fec090d00f38de64b591bcddcb205aadf8ee

image/x-icon cur ico;

# Web fonts

application/font-woff                 woff;
application/font-woff2                woff2;
application/octet-stream              woff2;
application/vnd.ms-fontobject         eot;

# Browsers usually ignore the font media types and simply sniff
# the bytes to figure out the font type.
# https://mimesniff.spec.whatwg.org/#matching-a-font-type-pattern
#
# However, Blink and WebKit based browsers will show a warning
# in the console if the following font types are served with any
# other media types.

application/x-font-ttf                ttc ttf;
font/opentype                         otf;

# Other

application/xhtml+xml                 xhtml;
application/xslt+xml                  xsl;

text/css                              css;
text/csv                              csv;
text/html                             htm html shtml;
text/markdown                         md;
text/mathml                           mml;
text/plain                            txt;
text/vcard                            vcard vcf;
text/vnd.rim.location.xloc            xloc;
text/vnd.sun.j2me.app-descriptor      jad;
text/vnd.wap.wml                      wml;
text/vtt                              vtt;
text/x-component                      htc;
`;

var userWhiteList = [];