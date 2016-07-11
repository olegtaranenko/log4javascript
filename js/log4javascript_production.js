/**
 * Copyright 2015 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


!function(e,t){"function"==typeof define&&define.amd?define(e):"undefined"!=typeof module&&"object"==typeof exports?module.exports=e():t.log4javascript=e()}(function(){function isUndefined(e){return"undefined"==typeof e}function EventSupport(){}function Log4JavaScript(){}function toStr(e){return e&&e.toString?e.toString():String(e)}function getExceptionMessage(e){return e.message?e.message:e.description?e.description:toStr(e)}function getUrlFileName(e){var t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return e.substr(t+1)}function getExceptionStringRep(e){if(e){var t="Exception: "+getExceptionMessage(e);try{e.lineNumber&&(t+=" on line number "+e.lineNumber),e.fileName&&(t+=" in file "+getUrlFileName(e.fileName))}catch(n){logLog.warn("Unable to obtain file and line information for error")}return showStackTraces&&e.stack&&(t+=newLine+"Stack trace:"+newLine+e.stack),t}return null}function bool(e){return Boolean(e)}function trim(e){return e.replace(/^\s+/,"").replace(/\s+$/,"")}function splitIntoLines(e){var t=e.replace(/\r\n/g,"\n").replace(/\r/g,"\n");return t.split("\n")}function array_remove(e,t){for(var n=-1,r=0,o=e.length;o>r;r++)if(e[r]===t){n=r;break}return n>=0?(e.splice(n,1),!0):!1}function array_contains(e,t){for(var n=0,r=e.length;r>n;n++)if(e[n]==t)return!0;return!1}function extractBooleanFromParam(e,t){return isUndefined(e)?t:bool(e)}function extractStringFromParam(e,t){return isUndefined(e)?t:String(e)}function extractIntFromParam(e,t){if(isUndefined(e))return t;try{var n=parseInt(e,10);return isNaN(n)?t:n}catch(r){return logLog.warn("Invalid int param "+e,r),t}}function extractFunctionFromParam(e,t){return"function"==typeof e?e:t}function isError(e){return e instanceof Error}function handleError(e,t){logLog.error(e,t),log4javascript.dispatchEvent("error",{message:e,exception:t})}function Timer(e,t){this.name=e,this.level=isUndefined(t)?Level.INFO:t,this.start=new Date}function Logger(e){this.name=e,this.parent=null,this.children=[];var t=[],n=null,r=this.name===rootLoggerName,o=this.name===nullLoggerName,a=null,i=!1;this.addChild=function(e){this.children.push(e),e.parent=this,e.invalidateAppenderCache()};var s=!0;this.getAdditivity=function(){return s},this.setAdditivity=function(e){var t=s!=e;s=e,t&&this.invalidateAppenderCache()},this.addAppender=function(e){o?handleError("Logger.addAppender: you may not add an appender to the null logger"):e instanceof log4javascript.Appender?array_contains(t,e)||(t.push(e),e.setAddedToLogger(this),this.invalidateAppenderCache()):handleError("Logger.addAppender: appender supplied ('"+toStr(e)+"') is not a subclass of Appender")},this.removeAppender=function(e){array_remove(t,e),e.setRemovedFromLogger(this),this.invalidateAppenderCache()},this.removeAllAppenders=function(){var e=t.length;if(e>0){for(var n=0;e>n;n++)t[n].setRemovedFromLogger(this);t.length=0,this.invalidateAppenderCache()}},this.getEffectiveAppenders=function(){if(null===a||i){var e=r||!this.getAdditivity()?[]:this.parent.getEffectiveAppenders();a=e.concat(t),i=!1}return a},this.invalidateAppenderCache=function(){i=!0;for(var e=0,t=this.children.length;t>e;e++)this.children[e].invalidateAppenderCache()},this.log=function(e,t){if(enabled&&e.isGreaterOrEqual(this.getEffectiveLevel())){var n,r=t.length-1,o=t[r];t.length>1&&isError(o)&&(n=o,r--);for(var a=[],i=0;r>=i;i++)a[i]=t[i];var s=new LoggingEvent(this,new Date,e,a,n);this.callAppenders(s)}},this.callAppenders=function(e){for(var t=this.getEffectiveAppenders(),n=0,r=t.length;r>n;n++)t[n].doAppend(e)},this.setLevel=function(e){r&&null===e?handleError("Logger.setLevel: you cannot set the level of the root logger to null"):e instanceof Level?n=e:handleError("Logger.setLevel: level supplied to logger "+this.name+" is not an instance of log4javascript.Level")},this.getLevel=function(){return n},this.getEffectiveLevel=function(){for(var e=this;null!==e;e=e.parent){var t=e.getLevel();if(null!==t)return t}},this.group=function(e,t){if(enabled)for(var n=this.getEffectiveAppenders(),r=0,o=n.length;o>r;r++)n[r].group(e,t)},this.groupEnd=function(){if(enabled)for(var e=this.getEffectiveAppenders(),t=0,n=e.length;n>t;t++)e[t].groupEnd()};var l={};this.time=function(e,t){enabled&&(isUndefined(e)?handleError("Logger.time: a name for the timer must be supplied"):!t||t instanceof Level?l[e]=new Timer(e,t):handleError("Logger.time: level supplied to timer "+e+" is not an instance of log4javascript.Level"))},this.timeEnd=function(e){if(enabled)if(isUndefined(e))handleError("Logger.timeEnd: a name for the timer must be supplied");else if(l[e]){var t=l[e],n=t.getElapsedTime();this.log(t.level,["Timer "+toStr(e)+" completed in "+n+"ms"]),delete l[e]}else logLog.warn("Logger.timeEnd: no timer found with name "+e)},this.assert=function(e){if(enabled&&!e){for(var t=[],n=1,r=arguments.length;r>n;n++)t.push(arguments[n]);t=t.length>0?t:["Assertion Failure"],t.push(newLine),t.push(e),this.log(Level.ERROR,t)}},this.toString=function(){return"Logger["+this.name+"]"}}function SimpleLayout(){this.customFields=[]}function NullLayout(){this.customFields=[]}function XmlLayout(e){this.combineMessages=extractBooleanFromParam(e,!0),this.customFields=[]}function escapeNewLines(e){return e.replace(/\r\n|\r|\n/g,"\\r\\n")}function JsonLayout(e,t){this.readable=extractBooleanFromParam(e,!1),this.combineMessages=extractBooleanFromParam(t,!0),this.batchHeader=this.readable?"["+newLine:"[",this.batchFooter=this.readable?"]"+newLine:"]",this.batchSeparator=this.readable?","+newLine:",",this.setKeys(),this.colon=this.readable?": ":":",this.tab=this.readable?"	":"",this.lineBreak=this.readable?newLine:"",this.customFields=[]}function HttpPostDataLayout(){this.setKeys(),this.customFields=[],this.returnsPostData=!0}function formatObjectExpansion(e,t,n){function r(e,t,n){function a(e){for(var t=splitIntoLines(e),r=1,o=t.length;o>r;r++)t[r]=n+t[r];return t.join(newLine)}var i,s,l,u,p,c,g;if(n||(n=""),null===e)return"null";if("undefined"==typeof e)return"undefined";if("string"==typeof e)return a(e);if("object"==typeof e&&array_contains(o,e)){try{c=toStr(e)}catch(h){c="Error formatting property. Details: "+getExceptionStringRep(h)}return c+" [already expanded]"}if(e instanceof Array&&t>0){for(o.push(e),c="["+newLine,l=t-1,u=n+"  ",p=[],i=0,s=e.length;s>i;i++)try{g=r(e[i],l,u),p.push(u+g)}catch(h){p.push(u+"Error formatting array member. Details: "+getExceptionStringRep(h))}return c+=p.join(","+newLine)+newLine+n+"]"}if("[object Date]"==Object.prototype.toString.call(e))return e.toString();if("object"==typeof e&&t>0){o.push(e),c="{"+newLine,l=t-1,u=n+"  ",p=[];for(i in e)try{g=r(e[i],l,u),p.push(u+i+": "+g)}catch(h){p.push(u+i+": Error formatting property. Details: "+getExceptionStringRep(h))}return c+=p.join(","+newLine)+newLine+n+"}"}return a(toStr(e))}var o=[];return r(e,t,n)}function PatternLayout(e){e?this.pattern=e:this.pattern=PatternLayout.DEFAULT_CONVERSION_PATTERN,this.customFields=[]}function isHttpRequestSuccessful(e){return isUndefined(e.status)||0===e.status||e.status>=200&&e.status<300||1223==e.status}function AjaxAppender(e,t){function n(e){return w?(handleError("AjaxAppender: configuration option '"+e+"' may not be set after the appender has been initialized"),!1):!0}function r(){if(c&&enabled){F=!0;var e;if(h)A.length>0?(e=A.shift(),l(a(e),r)):(F=!1,g&&i());else{for(;e=A.shift();)l(a(e));F=!1,g&&i()}}}function o(){var e=!1;if(c&&enabled){for(var t,n=p.getLayout().allowBatching()?d:1,o=[];t=S.shift();)o.push(t),S.length>=n&&(A.push(o),o=[]);o.length>0&&A.push(o),e=A.length>0,h=!1,g=!1,r()}return e}function a(e){for(var t,n=[],r="";t=e.shift();)n.push(p.getLayout().formatWithException(t));return r=1==e.length?n.join(""):p.getLayout().batchHeader+n.join(p.getLayout().batchSeparator)+p.getLayout().batchFooter,b==p.defaults.contentType&&(r=p.getLayout().returnsPostData?r:urlEncode(v)+"="+urlEncode(r),r.length>0&&(r+="&"),r+="layout="+urlEncode(p.getLayout().toString())),r}function i(){window.setTimeout(r,f)}function s(){var e="AjaxAppender: could not create XMLHttpRequest object. AjaxAppender disabled";handleError(e),c=!1,y&&y(e)}function l(n,r){try{var o=getXmlHttp(s);if(c){o.onreadystatechange=function(){if(4==o.readyState){if(isHttpRequestSuccessful(o))m&&m(o),r&&r(o);else{var t="AjaxAppender.append: XMLHttpRequest request to URL "+e+" returned status code "+o.status;handleError(t),y&&y(t)}o.onreadystatechange=emptyFunction,o=null}},o.open("POST",e,!0),t&&withCredentialsSupported&&(o.withCredentials=!0);try{for(var a,i=0;a=T[i++];)o.setRequestHeader(a.name,a.value);o.setRequestHeader("Content-Type",b)}catch(l){var u="AjaxAppender.append: your browser's XMLHttpRequest implementation does not support setRequestHeader, therefore cannot post data. AjaxAppender disabled";return handleError(u),c=!1,void(y&&y(u))}o.send(n)}}catch(p){var g="AjaxAppender.append: error sending log message to "+e;handleError(g,p),c=!1,y&&y(g+". Details: "+getExceptionStringRep(p))}}function u(){if(w=!0,L){var e=window.onbeforeunload;window.onbeforeunload=function(){e&&e(),o()}}g&&i()}var p=this,c=!0;e||(handleError("AjaxAppender: URL must be specified in constructor"),c=!1);var g=this.defaults.timed,h=this.defaults.waitForResponse,d=this.defaults.batchSize,f=this.defaults.timerInterval,m=this.defaults.requestSuccessCallback,y=this.defaults.failCallback,v=this.defaults.postVarName,L=this.defaults.sendAllOnUnload,b=this.defaults.contentType,E=null,S=[],A=[],T=[],F=!1,w=!1;this.getSessionId=function(){return E},this.setSessionId=function(e){E=extractStringFromParam(e,null),this.layout.setCustomField("sessionid",E)},this.setLayout=function(e){n("layout")&&(this.layout=e,null!==E&&this.setSessionId(E))},this.isTimed=function(){return g},this.setTimed=function(e){n("timed")&&(g=bool(e))},this.getTimerInterval=function(){return f},this.setTimerInterval=function(e){n("timerInterval")&&(f=extractIntFromParam(e,f))},this.isWaitForResponse=function(){return h},this.setWaitForResponse=function(e){n("waitForResponse")&&(h=bool(e))},this.getBatchSize=function(){return d},this.setBatchSize=function(e){n("batchSize")&&(d=extractIntFromParam(e,d))},this.isSendAllOnUnload=function(){return L},this.setSendAllOnUnload=function(e){n("sendAllOnUnload")&&(L=extractBooleanFromParam(e,L))},this.setRequestSuccessCallback=function(e){m=extractFunctionFromParam(e,m)},this.setFailCallback=function(e){y=extractFunctionFromParam(e,y)},this.getPostVarName=function(){return v},this.setPostVarName=function(e){n("postVarName")&&(v=extractStringFromParam(e,v))},this.getHeaders=function(){return T},this.addHeader=function(e,t){"content-type"==e.toLowerCase()?b=t:T.push({name:e,value:t})},this.sendAll=r,this.sendAllRemaining=o,this.append=function(e){if(c){w||u(),S.push(e);var t=this.getLayout().allowBatching()?d:1;if(S.length>=t){for(var n,o=[];n=S.shift();)o.push(n);A.push(o),g||h&&(!h||F)||r()}}}}function createDefaultLogger(){return log4javascript.getLogger(defaultLoggerName)}Array.prototype.push||(Array.prototype.push=function(){for(var e=0,t=arguments.length;t>e;e++)this[this.length]=arguments[e];return this.length}),Array.prototype.shift||(Array.prototype.shift=function(){if(this.length>0){for(var e=this[0],t=0,n=this.length-1;n>t;t++)this[t]=this[t+1];return this.length=this.length-1,e}}),Array.prototype.splice||(Array.prototype.splice=function(e,t){var n=this.slice(e+t),r=this.slice(e,e+t);this.length=e;for(var o=[],a=0,i=arguments.length;i>a;a++)o[a]=arguments[a];var s=o.length>2?n=o.slice(2).concat(n):n;for(a=0,i=s.length;i>a;a++)this.push(s[a]);return r}),EventSupport.prototype={eventTypes:[],eventListeners:{},setEventTypes:function(e){if(e instanceof Array){this.eventTypes=e,this.eventListeners={};for(var t=0,n=this.eventTypes.length;n>t;t++)this.eventListeners[this.eventTypes[t]]=[]}else handleError("log4javascript.EventSupport ["+this+"]: setEventTypes: eventTypes parameter must be an Array")},addEventListener:function(e,t){"function"==typeof t?(array_contains(this.eventTypes,e)||handleError("log4javascript.EventSupport ["+this+"]: addEventListener: no event called '"+e+"'"),this.eventListeners[e].push(t)):handleError("log4javascript.EventSupport ["+this+"]: addEventListener: listener must be a function")},removeEventListener:function(e,t){"function"==typeof t?(array_contains(this.eventTypes,e)||handleError("log4javascript.EventSupport ["+this+"]: removeEventListener: no event called '"+e+"'"),array_remove(this.eventListeners[e],t)):handleError("log4javascript.EventSupport ["+this+"]: removeEventListener: listener must be a function")},dispatchEvent:function(e,t){if(array_contains(this.eventTypes,e))for(var n=this.eventListeners[e],r=0,o=n.length;o>r;r++)n[r](this,e,t);else handleError("log4javascript.EventSupport ["+this+"]: dispatchEvent: no event called '"+e+"'")}};var applicationStartDate=new Date,uniqueId="log4javascript_"+applicationStartDate.getTime()+"_"+Math.floor(1e8*Math.random()),emptyFunction=function(){},newLine="\r\n",pageLoaded=!1;Log4JavaScript.prototype=new EventSupport;var log4javascript=new Log4JavaScript;log4javascript.version="1.4.13",log4javascript.edition="log4javascript_production";var urlEncode="undefined"!=typeof window.encodeURIComponent?function(e){return encodeURIComponent(e)}:function(e){return escape(e).replace(/\+/g,"%2B").replace(/"/g,"%22").replace(/'/g,"%27").replace(/\//g,"%2F").replace(/=/g,"%3D")};Function.prototype.apply||(Function.prototype.apply=function(obj,args){var methodName="__apply__";"undefined"!=typeof obj[methodName]&&(methodName+=String(Math.random()).substr(2)),obj[methodName]=this;for(var argsStrings=[],i=0,len=args.length;len>i;i++)argsStrings[i]="args["+i+"]";var script="obj."+methodName+"("+argsStrings.join(",")+")",returnValue=eval(script);return delete obj[methodName],returnValue}),Function.prototype.call||(Function.prototype.call=function(e){for(var t=[],n=1,r=arguments.length;r>n;n++)t[n-1]=arguments[n];return this.apply(e,t)});var logLog={quietMode:!1,debugMessages:[],setQuietMode:function(e){this.quietMode=bool(e)},numberOfErrors:0,alertAllErrors:!1,setAlertAllErrors:function(e){this.alertAllErrors=e},debug:function(e){this.debugMessages.push(e)},displayDebug:function(){alert(this.debugMessages.join(newLine))},warn:function(e,t){},error:function(e,t){if((1==++this.numberOfErrors||this.alertAllErrors)&&!this.quietMode){var n="log4javascript error: "+e;t&&(n+=newLine+newLine+"Original error: "+getExceptionStringRep(t)),alert(n)}}};log4javascript.logLog=logLog,log4javascript.setEventTypes(["load","error"]),log4javascript.handleError=handleError;var enabled=!("undefined"!=typeof log4javascript_disabled&&log4javascript_disabled);log4javascript.setEnabled=function(e){enabled=bool(e)},log4javascript.isEnabled=function(){return enabled};var useTimeStampsInMilliseconds=!0;log4javascript.setTimeStampsInMilliseconds=function(e){useTimeStampsInMilliseconds=bool(e)},log4javascript.isTimeStampsInMilliseconds=function(){return useTimeStampsInMilliseconds},log4javascript.evalInScope=function(expr){return eval(expr)};var showStackTraces=!1;log4javascript.setShowStackTraces=function(e){showStackTraces=bool(e)};var Level=function(e,t){this.level=e,this.name=t};Level.prototype={toString:function(){return this.name},equals:function(e){return this.level==e.level},isGreaterOrEqual:function(e){return this.level>=e.level}},Level.ALL=new Level(Number.MIN_VALUE,"ALL"),Level.TRACE=new Level(1e4,"TRACE"),Level.DEBUG=new Level(2e4,"DEBUG"),Level.INFO=new Level(3e4,"INFO"),Level.WARN=new Level(4e4,"WARN"),Level.ERROR=new Level(5e4,"ERROR"),Level.FATAL=new Level(6e4,"FATAL"),Level.OFF=new Level(Number.MAX_VALUE,"OFF"),log4javascript.Level=Level,Timer.prototype.getElapsedTime=function(){return(new Date).getTime()-this.start.getTime()};var anonymousLoggerName="[anonymous]",defaultLoggerName="[default]",nullLoggerName="[null]",rootLoggerName="root";Logger.prototype={trace:function(){this.log(Level.TRACE,arguments)},debug:function(){this.log(Level.DEBUG,arguments)},info:function(){this.log(Level.INFO,arguments)},warn:function(){this.log(Level.WARN,arguments)},error:function(){this.log(Level.ERROR,arguments)},fatal:function(){this.log(Level.FATAL,arguments)},isEnabledFor:function(e){return e.isGreaterOrEqual(this.getEffectiveLevel())},isTraceEnabled:function(){return this.isEnabledFor(Level.TRACE)},isDebugEnabled:function(){return this.isEnabledFor(Level.DEBUG)},isInfoEnabled:function(){return this.isEnabledFor(Level.INFO)},isWarnEnabled:function(){return this.isEnabledFor(Level.WARN)},isErrorEnabled:function(){return this.isEnabledFor(Level.ERROR)},isFatalEnabled:function(){return this.isEnabledFor(Level.FATAL)}},Logger.prototype.trace.isEntryPoint=!0,Logger.prototype.debug.isEntryPoint=!0,Logger.prototype.info.isEntryPoint=!0,Logger.prototype.warn.isEntryPoint=!0,Logger.prototype.error.isEntryPoint=!0,Logger.prototype.fatal.isEntryPoint=!0;var loggers={},loggerNames=[],ROOT_LOGGER_DEFAULT_LEVEL=Level.DEBUG,rootLogger=new Logger(rootLoggerName);rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL),log4javascript.getRootLogger=function(){return rootLogger},log4javascript.getLogger=function(e){if("string"!=typeof e&&(e=anonymousLoggerName,logLog.warn("log4javascript.getLogger: non-string logger name "+toStr(e)+" supplied, returning anonymous logger")),e==rootLoggerName&&handleError("log4javascript.getLogger: root logger may not be obtained by name"),!loggers[e]){var t=new Logger(e);loggers[e]=t,loggerNames.push(e);var n,r=e.lastIndexOf(".");if(r>-1){var o=e.substring(0,r);n=log4javascript.getLogger(o)}else n=rootLogger;n.addChild(t)}return loggers[e]};var defaultLogger=null;log4javascript.getDefaultLogger=function(){return defaultLogger||(defaultLogger=createDefaultLogger()),defaultLogger};var nullLogger=null;log4javascript.getNullLogger=function(){return nullLogger||(nullLogger=new Logger(nullLoggerName),nullLogger.setLevel(Level.OFF)),nullLogger},log4javascript.resetConfiguration=function(){rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL),loggers={}};var LoggingEvent=function(e,t,n,r,o){this.logger=e,this.timeStamp=t,this.timeStampInMilliseconds=t.getTime(),this.timeStampInSeconds=Math.floor(this.timeStampInMilliseconds/1e3),this.milliseconds=this.timeStamp.getMilliseconds(),this.level=n,this.messages=r,this.exception=o};LoggingEvent.prototype={getThrowableStrRep:function(){return this.exception?getExceptionStringRep(this.exception):""},getCombinedMessages:function(){return 1==this.messages.length?this.messages[0]:this.messages.join(newLine)},toString:function(){return"LoggingEvent["+this.level+"]"}},log4javascript.LoggingEvent=LoggingEvent;var Layout=function(){};Layout.prototype={defaults:{loggerKey:"logger",timeStampKey:"timestamp",millisecondsKey:"milliseconds",levelKey:"level",messageKey:"message",exceptionKey:"exception",urlKey:"url"},loggerKey:"logger",timeStampKey:"timestamp",millisecondsKey:"milliseconds",levelKey:"level",messageKey:"message",exceptionKey:"exception",urlKey:"url",batchHeader:"",batchFooter:"",batchSeparator:"",returnsPostData:!1,overrideTimeStampsSetting:!1,useTimeStampsInMilliseconds:null,format:function(){handleError("Layout.format: layout supplied has no format() method")},ignoresThrowable:function(){handleError("Layout.ignoresThrowable: layout supplied has no ignoresThrowable() method")},getContentType:function(){return"text/plain"},allowBatching:function(){return!0},setTimeStampsInMilliseconds:function(e){this.overrideTimeStampsSetting=!0,this.useTimeStampsInMilliseconds=bool(e)},isTimeStampsInMilliseconds:function(){return this.overrideTimeStampsSetting?this.useTimeStampsInMilliseconds:useTimeStampsInMilliseconds},getTimeStampValue:function(e){return this.isTimeStampsInMilliseconds()?e.timeStampInMilliseconds:e.timeStampInSeconds},getDataValues:function(e,t){var n=[[this.loggerKey,e.logger.name],[this.timeStampKey,this.getTimeStampValue(e)],[this.levelKey,e.level.name],[this.urlKey,window.location.href],[this.messageKey,t?e.getCombinedMessages():e.messages]];if(this.isTimeStampsInMilliseconds()||n.push([this.millisecondsKey,e.milliseconds]),e.exception&&n.push([this.exceptionKey,getExceptionStringRep(e.exception)]),this.hasCustomFields())for(var r=0,o=this.customFields.length;o>r;r++){var a=this.customFields[r].value;"function"==typeof a&&(a=a(this,e)),n.push([this.customFields[r].name,a])}return n},setKeys:function(e,t,n,r,o,a,i){this.loggerKey=extractStringFromParam(e,this.defaults.loggerKey),this.timeStampKey=extractStringFromParam(t,this.defaults.timeStampKey),this.levelKey=extractStringFromParam(n,this.defaults.levelKey),this.messageKey=extractStringFromParam(r,this.defaults.messageKey),this.exceptionKey=extractStringFromParam(o,this.defaults.exceptionKey),this.urlKey=extractStringFromParam(a,this.defaults.urlKey),this.millisecondsKey=extractStringFromParam(i,this.defaults.millisecondsKey)},setCustomField:function(e,t){for(var n=!1,r=0,o=this.customFields.length;o>r;r++)this.customFields[r].name===e&&(this.customFields[r].value=t,n=!0);n||this.customFields.push({name:e,value:t})},hasCustomFields:function(){return this.customFields.length>0},formatWithException:function(e){var t=this.format(e);return e.exception&&this.ignoresThrowable()&&(t+=e.getThrowableStrRep()),t},toString:function(){handleError("Layout.toString: all layouts must override this method")}},log4javascript.Layout=Layout;var Appender=function(){};Appender.prototype=new EventSupport,Appender.prototype.layout=new PatternLayout,Appender.prototype.threshold=Level.ALL,Appender.prototype.loggers=[],Appender.prototype.doAppend=function(e){enabled&&e.level.level>=this.threshold.level&&this.append(e)},Appender.prototype.append=function(e){},Appender.prototype.setLayout=function(e){e instanceof Layout?this.layout=e:handleError("Appender.setLayout: layout supplied to "+this.toString()+" is not a subclass of Layout")},Appender.prototype.getLayout=function(){return this.layout},Appender.prototype.setThreshold=function(e){e instanceof Level?this.threshold=e:handleError("Appender.setThreshold: threshold supplied to "+this.toString()+" is not a subclass of Level")},Appender.prototype.getThreshold=function(){return this.threshold},Appender.prototype.setAddedToLogger=function(e){this.loggers.push(e)},Appender.prototype.setRemovedFromLogger=function(e){array_remove(this.loggers,e)},Appender.prototype.group=emptyFunction,Appender.prototype.groupEnd=emptyFunction,Appender.prototype.toString=function(){handleError("Appender.toString: all appenders must override this method")},log4javascript.Appender=Appender,SimpleLayout.prototype=new Layout,SimpleLayout.prototype.format=function(e){return e.level.name+" - "+e.getCombinedMessages()},SimpleLayout.prototype.ignoresThrowable=function(){return!0},SimpleLayout.prototype.toString=function(){return"SimpleLayout"},log4javascript.SimpleLayout=SimpleLayout,NullLayout.prototype=new Layout,NullLayout.prototype.format=function(e){return e.messages},NullLayout.prototype.ignoresThrowable=function(){return!0},NullLayout.prototype.formatWithException=function(e){var t=e.messages,n=e.exception;return n?t.concat([n]):t},NullLayout.prototype.toString=function(){return"NullLayout"},log4javascript.NullLayout=NullLayout,XmlLayout.prototype=new Layout,XmlLayout.prototype.isCombinedMessages=function(){return this.combineMessages},XmlLayout.prototype.getContentType=function(){return"text/xml"},XmlLayout.prototype.escapeCdata=function(e){return e.replace(/\]\]>/,"]]>]]&gt;<![CDATA[")},XmlLayout.prototype.format=function(e){function t(e){return e="string"==typeof e?e:toStr(e),"<log4javascript:message><![CDATA["+o.escapeCdata(e)+"]]></log4javascript:message>"}var n,r,o=this,a='<log4javascript:event logger="'+e.logger.name+'" timestamp="'+this.getTimeStampValue(e)+'"';if(this.isTimeStampsInMilliseconds()||(a+=' milliseconds="'+e.milliseconds+'"'),a+=' level="'+e.level.name+'">'+newLine,this.combineMessages)a+=t(e.getCombinedMessages());else{for(a+="<log4javascript:messages>"+newLine,n=0,r=e.messages.length;r>n;n++)a+=t(e.messages[n])+newLine;a+="</log4javascript:messages>"+newLine}if(this.hasCustomFields())for(n=0,r=this.customFields.length;r>n;n++)a+='<log4javascript:customfield name="'+this.customFields[n].name+'"><![CDATA['+this.customFields[n].value.toString()+"]]></log4javascript:customfield>"+newLine;return e.exception&&(a+="<log4javascript:exception><![CDATA["+getExceptionStringRep(e.exception)+"]]></log4javascript:exception>"+newLine),a+="</log4javascript:event>"+newLine+newLine},XmlLayout.prototype.ignoresThrowable=function(){return!1},XmlLayout.prototype.toString=function(){return"XmlLayout"},log4javascript.XmlLayout=XmlLayout,JsonLayout.prototype=new Layout,JsonLayout.prototype.isReadable=function(){return this.readable},JsonLayout.prototype.isCombinedMessages=function(){return this.combineMessages},JsonLayout.prototype.format=function(e){function t(e,n,r){var a,i=typeof e;if(e instanceof Date)a=String(e.getTime());else if(r&&e instanceof Array){a="["+o.lineBreak;for(var s=0,l=e.length;l>s;s++){var u=n+o.tab;a+=u+t(e[s],u,!1),s<e.length-1&&(a+=","),a+=o.lineBreak}a+=n+"]"}else a="number"!==i&&"boolean"!==i?'"'+escapeNewLines(JSON.stringify(e).replace(/\"/g,'\\"'))+'"':e;return a}var n,r,o=this,a=this.getDataValues(e,this.combineMessages),i="{"+this.lineBreak;for(n=0,r=a.length-1;r>=n;n++)i+=this.tab+'"'+a[n][0]+'"'+this.colon+t(a[n][1],this.tab,!0),r>n&&(i+=","),i+=this.lineBreak;return i+="}"+this.lineBreak},JsonLayout.prototype.ignoresThrowable=function(){return!1},JsonLayout.prototype.toString=function(){return"JsonLayout"},JsonLayout.prototype.getContentType=function(){return"application/json"},log4javascript.JsonLayout=JsonLayout,HttpPostDataLayout.prototype=new Layout,HttpPostDataLayout.prototype.allowBatching=function(){return!1},HttpPostDataLayout.prototype.format=function(e){for(var t=this.getDataValues(e),n=[],r=0,o=t.length;o>r;r++){var a=t[r][1]instanceof Date?String(t[r][1].getTime()):t[r][1];n.push(urlEncode(t[r][0])+"="+urlEncode(a))}return n.join("&")},HttpPostDataLayout.prototype.ignoresThrowable=function(e){return!1},HttpPostDataLayout.prototype.toString=function(){return"HttpPostDataLayout"},log4javascript.HttpPostDataLayout=HttpPostDataLayout;var SimpleDateFormat;!function(){var e=/('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/,t=["January","February","March","April","May","June","July","August","September","October","November","December"],n=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],r=0,o=1,a=2,i=3,s=4,l=5,u={G:r,y:i,M:s,w:a,W:a,D:a,d:a,F:a,E:o,a:r,H:a,k:a,K:a,h:a,m:a,s:a,S:a,Z:l},p=864e5,c=7*p,g=1,h=function(e,t,n){var r=new Date(e,t,n,0,0,0);return r.setMilliseconds(0),r};Date.prototype.getDifference=function(e){return this.getTime()-e.getTime()},Date.prototype.isBefore=function(e){return this.getTime()<e.getTime()},Date.prototype.getUTCTime=function(){return Date.UTC(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds())},Date.prototype.getTimeSince=function(e){return this.getUTCTime()-e.getUTCTime()},Date.prototype.getPreviousSunday=function(){var e=new Date(this.getFullYear(),this.getMonth(),this.getDate(),12,0,0),t=new Date(e.getTime()-this.getDay()*p);return h(t.getFullYear(),t.getMonth(),t.getDate())},Date.prototype.getWeekInYear=function(e){isUndefined(this.minimalDaysInFirstWeek)&&(e=g);var t=this.getPreviousSunday(),n=h(this.getFullYear(),0,1),r=t.isBefore(n)?0:1+Math.floor(t.getTimeSince(n)/c),o=7-n.getDay(),a=r;return e>o&&a--,a},Date.prototype.getWeekInMonth=function(e){isUndefined(this.minimalDaysInFirstWeek)&&(e=g);var t=this.getPreviousSunday(),n=h(this.getFullYear(),this.getMonth(),1),r=t.isBefore(n)?0:1+Math.floor(t.getTimeSince(n)/c),o=7-n.getDay(),a=r;return o>=e&&a++,a},Date.prototype.getDayInYear=function(){var e=h(this.getFullYear(),0,1);return 1+Math.floor(this.getTimeSince(e)/p)},SimpleDateFormat=function(e){this.formatString=e},SimpleDateFormat.prototype.setMinimalDaysInFirstWeek=function(e){this.minimalDaysInFirstWeek=e},SimpleDateFormat.prototype.getMinimalDaysInFirstWeek=function(){return isUndefined(this.minimalDaysInFirstWeek)?g:this.minimalDaysInFirstWeek};var d=function(e,t){for(;e.length<t;)e="0"+e;return e},f=function(e,t,n){return t>=4?e:e.substr(0,Math.max(n,t))},m=function(e,t){var n=""+e;return d(n,t)};SimpleDateFormat.prototype.format=function(p){for(var c,g="",h=this.formatString;c=e.exec(h);){var y=c[1],v=c[2],L=c[3],b=c[4];if(y)g+="''"==y?"'":y.substring(1,y.length-1);else if(L);else if(b)g+=b;else if(v){var E=v.charAt(0),S=v.length,A="";switch(E){case"G":A="AD";break;case"y":A=p.getFullYear();break;case"M":A=p.getMonth();break;case"w":A=p.getWeekInYear(this.getMinimalDaysInFirstWeek());break;case"W":A=p.getWeekInMonth(this.getMinimalDaysInFirstWeek());break;case"D":A=p.getDayInYear();break;case"d":A=p.getDate();break;case"F":A=1+Math.floor((p.getDate()-1)/7);break;case"E":A=n[p.getDay()];break;case"a":A=p.getHours()>=12?"PM":"AM";break;case"H":A=p.getHours();break;case"k":A=p.getHours()||24;break;case"K":A=p.getHours()%12;break;case"h":A=p.getHours()%12||12;break;case"m":A=p.getMinutes();break;case"s":A=p.getSeconds();break;case"S":A=p.getMilliseconds();break;case"Z":A=p.getTimezoneOffset()}switch(u[E]){case r:g+=f(A,S,2);break;case o:g+=f(A,S,3);break;case a:g+=m(A,S);break;case i:if(3>=S){var T=""+A;g+=T.substr(2,2)}else g+=m(A,S);break;case s:g+=S>=3?f(t[A],S,S):m(A+1,S);break;case l:var F=A>0,w=F?"-":"+",D=Math.abs(A),j=""+Math.floor(D/60);j=d(j,2);var M=""+D%60;M=d(M,2),g+=w+j+M}}h=h.substr(c.index+c[0].length)}return g}}(),log4javascript.SimpleDateFormat=SimpleDateFormat,PatternLayout.TTCC_CONVERSION_PATTERN="%r %p %c - %m%n",PatternLayout.DEFAULT_CONVERSION_PATTERN="%m%n",PatternLayout.ISO8601_DATEFORMAT="yyyy-MM-dd HH:mm:ss,SSS",PatternLayout.DATETIME_DATEFORMAT="dd MMM yyyy HH:mm:ss,SSS",PatternLayout.ABSOLUTETIME_DATEFORMAT="HH:mm:ss,SSS",PatternLayout.prototype=new Layout,PatternLayout.prototype.format=function(e){for(var t,n=/%(-?[0-9]+)?(\.?[0-9]+)?([acdfmMnpr%])(\{([^\}]+)\})?|([^%]+)/,r="",o=this.pattern;t=n.exec(o);){var a=t[0],i=t[1],s=t[2],l=t[3],u=t[5],p=t[6];if(p)r+=""+p;else{var c="";switch(l){case"a":case"m":var g=0;u&&(g=parseInt(u,10),isNaN(g)&&(handleError("PatternLayout.format: invalid specifier '"+u+"' for conversion character '"+l+"' - should be a number"),g=0));for(var h="a"===l?e.messages[0]:e.messages,d=0,f=h.length;f>d;d++)d>0&&" "!==c.charAt(c.length-1)&&(c+=" "),c+=0===g?h[d]:formatObjectExpansion(h[d],g);break;case"c":var m=e.logger.name;if(u){var y=parseInt(u,10),v=e.logger.name.split(".");c=y>=v.length?m:v.slice(v.length-y).join(".")}else c=m;break;case"d":var L=PatternLayout.ISO8601_DATEFORMAT;u&&(L=u,"ISO8601"==L?L=PatternLayout.ISO8601_DATEFORMAT:"ABSOLUTE"==L?L=PatternLayout.ABSOLUTETIME_DATEFORMAT:"DATE"==L&&(L=PatternLayout.DATETIME_DATEFORMAT)),c=new SimpleDateFormat(L).format(e.timeStamp);break;case"f":if(this.hasCustomFields()){var b=0;u&&(b=parseInt(u,10),isNaN(b)?handleError("PatternLayout.format: invalid specifier '"+u+"' for conversion character 'f' - should be a number"):0===b?handleError("PatternLayout.format: invalid specifier '"+u+"' for conversion character 'f' - must be greater than zero"):b>this.customFields.length?handleError("PatternLayout.format: invalid specifier '"+u+"' for conversion character 'f' - there aren't that many custom fields"):b-=1);var E=this.customFields[b].value;"function"==typeof E&&(E=E(this,e)),c=E}break;case"n":c=newLine;break;case"p":c=e.level.name;break;case"r":c=""+e.timeStamp.getDifference(applicationStartDate);break;case"%":c="%";break;default:c=a}var S;if(s){S=parseInt(s.substr(1),10);var A=c.length;A>S&&(c=c.substring(A-S,A))}if(i)if("-"==i.charAt(0))for(S=parseInt(i.substr(1),10);c.length<S;)c+=" ";else for(S=parseInt(i,10);c.length<S;)c=" "+c;r+=c}o=o.substr(t.index+t[0].length)}return r},PatternLayout.prototype.ignoresThrowable=function(){return!0},PatternLayout.prototype.toString=function(){
    return"PatternLayout"},log4javascript.PatternLayout=PatternLayout;var xhrFactory=function(){return new XMLHttpRequest},xmlHttpFactories=[xhrFactory,function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],withCredentialsSupported=!1,getXmlHttp=function(e){for(var t,n=null,r=0,o=xmlHttpFactories.length;o>r;r++){t=xmlHttpFactories[r];try{return n=t(),withCredentialsSupported=t==xhrFactory&&"withCredentials"in n,getXmlHttp=t,n}catch(a){}}e?e():handleError("getXmlHttp: unable to obtain XMLHttpRequest object")};if(AjaxAppender.prototype=new Appender,AjaxAppender.prototype.defaults={waitForResponse:!1,timed:!1,timerInterval:1e3,batchSize:1,sendAllOnUnload:!1,requestSuccessCallback:null,failCallback:null,postVarName:"data",contentType:"application/x-www-form-urlencoded"},AjaxAppender.prototype.layout=new HttpPostDataLayout,AjaxAppender.prototype.toString=function(){return"AjaxAppender"},log4javascript.AjaxAppender=AjaxAppender,log4javascript.setDocumentReady=function(){pageLoaded=!0,log4javascript.dispatchEvent("load",{})},window.addEventListener)window.addEventListener("load",log4javascript.setDocumentReady,!1);else if(window.attachEvent)window.attachEvent("onload",log4javascript.setDocumentReady);else{var oldOnload=window.onload;"function"!=typeof window.onload?window.onload=log4javascript.setDocumentReady:window.onload=function(e){oldOnload&&oldOnload(e),log4javascript.setDocumentReady()}}return log4javascript},this);