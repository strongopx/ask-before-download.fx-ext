// block list draft
var mimeTypeBlackListText = `
# Derived from:
# https://github.com/h5bp/server-configs-nginx/blob/master/mime.types
#
# License:
# Copyright (c) Nginx Server Configs

# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# Ask Before Download
# !!! Need add apk to octet-stream !!!
application/vnd.android.package-archive   apk;
video/mp2t                           ts;

# Need to remove css html images

# Media files

audio/midi                            mid midi kar;
audio/mp4                             aac f4a f4b m4a;
audio/mpeg                            mp3;
audio/ogg                             oga ogg opus;
audio/x-realaudio                     ra;
audio/x-wav                           wav;

video/3gpp                            3gp 3gpp;
video/mp4                             f4p f4v m4v mp4;
video/mpeg                            mpeg mpg;
video/ogg                             ogv;
video/quicktime                       mov;
video/webm                            webm;
video/x-flv                           flv;
video/x-mng                           mng;
video/x-ms-asf                        asf asx;
video/x-ms-wmv                        wmv;
video/x-msvideo                       avi;

# Microsoft Office

application/msword                                                         doc;
application/vnd.ms-excel                                                   xls;
application/vnd.ms-powerpoint                                              ppt;
application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;

# Other

application/java-archive              ear jar war;
application/mac-binhex40              hqx;
application/octet-stream              bin deb dll dmg exe img iso msi msm msp safariextz apk;
application/pdf                       pdf;
application/postscript                ai eps ps;
application/rtf                       rtf;
application/vnd.google-earth.kml+xml  kml;
application/vnd.google-earth.kmz      kmz;
application/vnd.wap.wmlc              wmlc;
application/x-7z-compressed           7z;
application/x-bb-appworld             bbaw;
application/x-bittorrent              torrent;
application/x-chrome-extension        crx;
application/x-cocoa                   cco;
application/x-java-archive-diff       jardiff;
application/x-java-jnlp-file          jnlp;
application/x-makeself                run;
application/x-opera-extension         oex;
application/x-perl                    pl pm;
application/x-pilot                   pdb prc;
application/x-rar-compressed          rar;
application/x-redhat-package-manager  rpm;
application/x-sea                     sea;
# application/x-shockwave-flash         swf;
application/x-stuffit                 sit;
application/x-tcl                     tcl tk;
application/x-x509-ca-cert            crt der pem;
application/x-xpinstall               xpi;
# application/xhtml+xml                 xhtml;
# application/xslt+xml                  xsl;
application/zip                       zip;

`
;

var userBlackList = [];