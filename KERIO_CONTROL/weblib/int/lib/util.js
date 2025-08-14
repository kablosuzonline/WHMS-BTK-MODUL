
if (!window.kerio) {
kerio = {lib: {k_reportError: window.alert}};
}

kerio.lib.k_setSupportedLanguages = function(k_languageArray) {
if (!kerio.lib._k_settings) {
kerio.lib._k_settings = {};
}
kerio.lib._k_settings._k_supportedLanguages = k_languageArray;
};

kerio.lib.k_getSupportedLanguages = function() {
if (kerio.lib._k_settings) {
return kerio.lib._k_settings._k_supportedLanguages;
}
else {
return undefined;
}
};

kerio.lib.k_getCalculatedLanguage = function(k_browserPreferred) {
var
k_supportedLanguages = kerio.lib.k_getSupportedLanguages().join(','),
k_browserLang,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_browserPreferred.length; k_i < k_cnt; k_i++) {
k_browserLang = k_browserPreferred[k_i].substring(0,2);
if (-1 !== k_supportedLanguages.indexOf(k_browserLang)) {
return k_browserPreferred[k_i];
}
}
return 'en'; };

kerio.lib.k_getGrammarCategory = function(k_amount) {
var
k_singularText = 'singular',
k_dualText = 'dual',
k_pluralText = 'plural',
k_amountMod10,
k_amountMod100,
k_language;
k_language = kerio.lib.k_translation.k_currentLanguage || kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE;
switch (k_language) {
case 'cs':
case 'sk':
if (1 === k_amount) {
return k_singularText;
}
if ((k_amount > 1) && (k_amount < 5)) {
return k_dualText;
}
break;
case 'fr':
if (k_amount < 2) {
return k_singularText;
}
break;
case 'ru':
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((1 === k_amountMod10) && (11 !== k_amountMod100)) {
return k_singularText;
}
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 10) || (k_amountMod100 > 20))) {
return k_dualText;
}
break;
case 'pl':
if (1 === k_amount) {
return k_singularText;
}
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 10) || (k_amountMod100 > 20))) {
return k_dualText;
}
break;
case 'hr':
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((1 === k_amountMod10) && (11 !== k_amountMod100)) {
return k_singularText;
}
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 12) || (k_amountMod100 > 14))) {
return k_dualText;
}
break;
default:
if (1 === k_amount) {
return k_singularText;
}
}
return k_pluralText;
};

kerio.lib.k_tr = function(k_enString, k_context, k_options) {
if ('' === k_enString) {
return k_enString;
}
var
k_translation = k_enString,
k_defaultContext = 'common',
k_pluralityDefined = false,
k_pluralityRequired,
k_placeholdersRequired,
k_placeholdersDefined,
k_args, k_i, k_cnt;
if (undefined === k_options) {
k_options = {};
}
if (undefined !== k_options.k_pluralityBy) {
k_pluralityDefined = true;
}
if (undefined === k_context) {
k_context = k_defaultContext;
}
if (kerio.lib.k_translation) {
if (kerio.lib.k_translation[k_context]) {
k_translation = kerio.lib.k_translation[k_context][k_enString];
if (undefined === k_translation && k_defaultContext !== k_context && kerio.lib.k_translation[k_defaultContext]) {
k_translation = kerio.lib.k_translation[k_defaultContext][k_enString];
}
if (undefined === k_translation) {
k_translation = kerio.lib._k_createEngPluralText(k_enString);
}
}
else {
k_translation = kerio.lib._k_createEngPluralText(k_enString);
}
}
k_pluralityRequired = false;
if ('object' === typeof k_translation) {
k_pluralityRequired = true;
}
if (k_pluralityRequired && !k_pluralityDefined) {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: '
+ k_context + '\n' + '\n' + 'No plurality parameters defined but required!', 'translator.js');
return k_translation.k_singular;
}
if (k_pluralityRequired && k_pluralityDefined) {
switch (kerio.lib.k_getGrammarCategory(k_options.k_pluralityBy)) {
case 'singular':
if (undefined !== k_translation.k_singular) {
k_translation = k_translation.k_singular;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Singular not defined!', 'translator.js');
}
break;
case 'dual':
if (undefined !== k_translation.k_dual) {
k_translation = k_translation.k_dual;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Dual/Paucal not defined!', 'translator.js');
}
break;
default:
if (undefined !== k_translation.k_plural) {
k_translation = k_translation.k_plural;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Plural not defined!', 'translator.js');
}
}
}
k_placeholdersRequired = false;
if (-1 !== k_translation.toString().indexOf('%')) {
k_placeholdersRequired = true;
}
k_placeholdersDefined = false;
if (undefined !== k_options.k_args) {
k_placeholdersDefined = true;
}
if (k_placeholdersRequired && !k_placeholdersDefined) {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'No placeholder parameters defined but required!', 'translator.js');
return k_translation;
}
if ( k_placeholdersRequired && k_placeholdersDefined) {
k_args = k_options.k_args;
k_cnt = k_args.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_translation = k_translation.replace(('%' + (k_i + 1)), '{%' + (k_i + 1) + '%}');
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_translation = k_translation.replace(('{%' + (k_i + 1) + '%}'), true === k_options.k_isSecure ? k_args[k_i] : kerio.lib.k_htmlEncode(k_args[k_i]));
}
}
return k_translation;
}; 
kerio.lib._k_createEngPluralText = function(k_text) {
var
k_isCompoundMessageRegex = new RegExp('[^\\[]*(\\[([^\\[\\|\\]]{1,})\\|([^\\]\\|\\[]{1,})\\]).*'),
k_compoundText;
if (!k_isCompoundMessageRegex.test(k_text)) {
return k_text;
}
k_compoundText = {
k_singular: k_text,
k_plural: k_text
};
kerio.lib._k_compileCompoundText(k_compoundText, k_isCompoundMessageRegex);
return {
k_singular: k_compoundText.k_singular,
k_dual: k_compoundText.k_plural,
k_plural: k_compoundText.k_plural
};
};

kerio.lib._k_compileCompoundText = function(k_text, k_regex) {
var
k_parsedSingular,
k_parsedPlural;
if (!k_regex.test(k_text.k_singular) || !k_regex.test(k_text.k_plural)) {
return;
}
k_parsedSingular = k_regex.exec(k_text.k_singular);
k_parsedPlural = k_regex.exec(k_text.k_plural);
k_text.k_singular = k_parsedSingular[0].replace(k_parsedSingular[1],k_parsedSingular[2]);
k_text.k_plural = k_parsedPlural[0].replace(k_parsedPlural[1],k_parsedPlural[3]);
kerio.lib._k_compileCompoundText(k_text, k_regex);
};


kerio.lib.k_languageDependentValue = function(k_valuesCfg) {
var
k_engineConstants = kerio.lib.k_engineConstants,
k_currentLanguage;
if (k_engineConstants && k_engineConstants.k_CURRENT_LANGUAGE) {
k_currentLanguage = k_engineConstants.k_CURRENT_LANGUAGE;
}
else {
k_currentLanguage = 'en';
}
return undefined !== k_valuesCfg[k_currentLanguage] ? k_valuesCfg[k_currentLanguage] : k_valuesCfg.k_default;
};