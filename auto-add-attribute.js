/**
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-12-04 09:03:09
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-11 11:47:39
 * @FilePath: auto-add-attribute.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */

const fs = require('fs');
const parser = require('vue-template-compiler');
const { JSDOM } = require('jsdom');
const path = require('path');
// const readline = require('readline');
const log4js = require('log4js');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, './attribute.config.json'), 'utf8'));
const V_FOR_EMPTY_KEY = 'EMPTY_KEY';
const SPLIT_IDENTIFIER = '_';
const TEMPLATE_TAG_NAME = 'TEMPLATE_TAG_NAME';
const logger = log4js.getLogger();
log4js.configure({
    replaceConsole: true,
    appenders: {
        cheese: {
            // 设置类型为 dateFile
            type: 'dateFile',
            // 配置文件名为 myLog.log
            filename: path.join(config.logs.path, 'autoAddAttribute'),
            // 指定编码格式为 utf-8
            encoding: 'utf-8',
            // 配置 layout，此处使用自定义模式 pattern
            layout: {
                type: 'pattern',
                // 配置模式
                // pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
                pattern: '%d %p %m',
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyy-MM-dd',
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true,
        },
    },
    categories: {
        // 设置默认的 categories
        default: { appenders: ['cheese'], level: 'debug' },
    },
});

/**
 * @description 获取文件夹大小
 * @param {String} folderPath 文件夹路径
 * @param {Function} errHandler 错误处理函数
 * @returns禁止
 */
function getFolderSize(folderPath, errHandler) {
    let totalSize = 0;
    try {
        const fileNames = fs.readdirSync(folderPath);
        fileNames.forEach((fileName) => {
            const filePath = path.join(folderPath, fileName);
            totalSize += fs.statSync(filePath).size;
        });
    } catch (err) {
        errHandler && errHandler(err);
    }
    return totalSize;
}

/**
 * @description 检查日志是否已满
 * @param {Object} logConfig 日志配置
 * @param {Function} handler 回调（路径）
 */
function checkLogFull(logConfig, handler) {
    const logPath = logConfig.path;
    const logLimitSize = logConfig.size;
    const logSize = getFolderSize(logPath, (err) => logger.error(err));
    if (logSize > logLimitSize) {
        console.log('💄', new Date(), ' Logs has reached the limit, clearing half of......');
        handler && handler(logPath);
        console.log('✅ ', new Date(), ' Logs cleaned up.');
    }
}

/**
 * @description 删除文件夹下所有文件
 * @param {String} folderPath 文件夹路径
 * @param {Function} errHandler 错误处理函数
 */
function clearHalfFolder(folderPath, errHandler) {
    try {
        const fileNames = fs.readdirSync(folderPath);
        // 每次删除一半
        const halfFileNames = fileNames.slice(0, Math.floor(fileNames.length / 2));
        halfFileNames.forEach((fileName) => {
            const filePath = path.join(folderPath, fileName);
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        errHandler && errHandler(err);
    }
}

/**
 * @description 深度优先遍历文件
 * @param {String} filePath 遍历文件（夹）路径
 * @param {String} extendName 文件类型
 * @param {Function} handler 回调 （文件名称，文件内容）
 * */
function dfsFile(filePath, extendName, handler) {
    const stat = fs.lstatSync(filePath);
    if (stat.isFile()) {
        if (path.extname(filePath) === `.${extendName}`) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            handler && handler(filePath, fileContent);
        }
    } else {
        const fileNames = fs.readdirSync(filePath);
        fileNames.forEach((name) => {
            dfsFile(path.join(filePath, name), extendName, handler);
        });
    }
}

/**
 * @description 根据标签名判断是否是标准HTML节点
 * @param {String} tagName 标签名
 * @return {Boolean}
 * */
function isStandardHTMLTag(tagName = '') {
    // 定义常见的 HTML 标签名列表
    const htmlTagPattern =
        /^(?:a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|autoAddAttribute|map|mark|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)$/i;
    return htmlTagPattern.test(tagName.toLowerCase());
}

/**
 * @description 判断标签是否为单标签
 * @param {HTMLElement} element 标签名
 * @return {Boolean}
 * */
function isVoidElement(element) {
    const VOID_ELEMENTS = new Set([
        'AREA',
        'BASE',
        'BR',
        'COL',
        'EMBED',
        'HR',
        'IMG',
        'INPUT',
        'LINK',
        'META',
        'PARAM',
        'SOURCE',
        'TRACK',
        'WBR',
    ]);
    return (
        element.nodeType === element.ELEMENT_NODE &&
        VOID_ELEMENTS.has(element.tagName.toUpperCase())
    );
}

/**
 * @description 判断是否为template节点
 * @param {HTMLElement} node HTML节点
 * @return {Boolean}
 * */
function isTemlateNode(node) {
    return node.tagName.toUpperCase() === TEMPLATE_TAG_NAME;
}

/**
 * @description 处理Template节点
 * @return {Number} 处理过的innerHTML
 * */
function encodeTemplate(htmlText) {
    return htmlText.replace(/template/g, TEMPLATE_TAG_NAME);
}

/**
 * @description 还原Template节点
 * @return {Number} 还原过的innerHTML
 * */
function decodeTemplate(htmlText) {
    return htmlText.replace(new RegExp(TEMPLATE_TAG_NAME.toLowerCase(), 'g'), 'template');
}

/**
 * @description 从给定节点中查找key值
 * @param {Array} vForNodes HTML节点列表
 * @return {String} key
 * */
function getVForKey(vForNodes) {
    const keyAttributeName = ['key', 'kEy', 'keY', 'kEY', 'Key', 'KeY', 'KEy', 'KEY'];
    for (const node of vForNodes) {
        for (let keyName of keyAttributeName) {
            if (node.hasAttribute(`:${keyName}`)) {
                return node.getAttribute(`:${keyName}`);
            }
            if (node.hasAttribute(keyName)) {
                return node.getAttribute(keyName);
            }
        }
    }
    return V_FOR_EMPTY_KEY;
}

/**
 * @description 为v-for生成的节点添加vFor属性，值为key
 * @param {HTMLElement} element HTML节点
 * */
function markVForNode(element, handler) {
    if (element.hasAttribute('v-for')) {
        const vForNodeList = element.querySelectorAll('*');
        const vForNodes = [element, ...vForNodeList];
        const key = getVForKey(vForNodes);
        vForNodes.forEach((vForNode) => {
            if (!isTemlateNode(vForNode)) {
                handler && handler(vForNode, key);
            }
        });
    }
}

/**
 * @description 手动拼接获取HTML字符（JSDOM拼接会将空属性赋值为'' 例如 <span cuifan></span> -> <span cuifan=""></span>）
 * @param {HTMLElement} element 标签名
 * @return {String}
 * */
function serializeElement(element) {
    if (element.nodeType === element.TEXT_NODE) {
        return element.nodeValue;
    }
    if (element.nodeType === element.COMMENT_NODE) {
        return `<!--${element.nodeValue}-->`;
    }
    const tagName = element.tagName.toLowerCase();
    let htmlStr = `<${tagName}`;
    for (const attrName of element.getAttributeNames()) {
        htmlStr += ` ${attrName}`;
        const attrValue = element.getAttribute(attrName);
        if (attrValue !== '') {
            htmlStr += `="${attrValue}"`;
        }
    }
    htmlStr += isVoidElement(element) ? ' />' : '>';

    for (const childNode of element.childNodes) {
        htmlStr += serializeElement(childNode);
    }
    if (!isVoidElement(element)) {
        htmlStr += `</${tagName}>`;
    }
    return htmlStr;
}

/**
 * @description 处理Template 自定义组件大写不符合DOM规范被JSDOM转为小写问题
 * @param {String} originalHtml 源代码
 * @param {String} processedHtml JSDOM处理过的代码
 * @return {Boolean}
 * */
function preserveTagCase(originalHtml, processedHtml) {
    // 创建映射表，记录原始 HTML 中标签的大小写
    const tagMap = new Map();
    // 匹配开始标签、结束标签和自闭合标签
    originalHtml.replace(/<([A-Za-z0-9-]+)[^>]*\/?>/g, (match, openTag) => {
        if (!isStandardHTMLTag(openTag)) {
            tagMap.set(openTag.toLowerCase(), openTag);
        }
        return match;
    });
    let preservedHtml = processedHtml.replace(/<.?body>/g, '');
    tagMap.forEach((originTag, lowerTag) => {
        const openTagRegex = new RegExp(`<${lowerTag}`, 'g');
        const closeTagRegex = new RegExp(`</${lowerTag}`, 'g');
        preservedHtml = preservedHtml
            .replace(openTagRegex, `<${originTag}`)
            .replace(closeTagRegex, `</${originTag}`);
    });
    return preservedHtml;
}

/**
 * @description 从指定DOM 数组中获取起始属性
 * @param {Array} elements NodeList
 * @param {String} identifier 自增属性标识符
 * @param {String} attribute 属性名
 * @return {Number} idCounter 自增起始属性值
 * */
function getStartIDFromElements(elements, identifier = '', attribute = 'id') {
    let idStartCounter = 0;
    let keyStartCounter = 0;
    elements.forEach((element) => {
        const id = element.getAttribute(attribute)?.trim();
        if (id && id.startsWith(identifier)) {
            const idString = id.replace(identifier, '').trim();
            const idCount = parseInt(idString);
            if (!isNaN(idCount)) {
                idStartCounter = Math.max(idStartCounter, idCount);
            }
            const keyStringArray = idString.split(SPLIT_IDENTIFIER);
            const keyCount = parseInt(keyStringArray[1]);
            if (!isNaN(keyCount)) {
                keyStartCounter = Math.max(keyStartCounter, keyCount);
            }
        }
    });
    return {
        startID: idStartCounter + 1,
        startKey: keyStartCounter + 1,
    };
}

/**
 * @description 给指定HTML文本 节点下所有子节点批量添加属性
 * @param {String} htmlText html文本
 * @param {String} identifier 自增属性标识符
 * @param {String} attribute 属性名
 * @return {String} 添加之后的HTML文本
 * */
function addIdToElements(htmlText, attribute = 'id', identifier) {
    // 处理template节点（非标准dom）
    const htmlProcessedText = encodeTemplate(htmlText);

    const root = new JSDOM(htmlProcessedText);
    const body = root.window.document.body;
    const elements = body.querySelectorAll('*');

    // 标记v-for及其子节点
    elements.forEach((element) => {
        markVForNode(element, (vForNode, key) => {
            vForNode.vFor = key;
        });
    });

    // 为每个节点添加id
    let { startID, startKey } = getStartIDFromElements(elements, identifier, attribute);
    elements.forEach((element) => {
        // 如果是template或存在id
        if (
            isTemlateNode(element) ||
            element.hasAttribute(attribute) ||
            element.hasAttribute(`:${attribute}`)
        ) {
            return;
        }
        // 被v-for的节点
        if (Object.prototype.hasOwnProperty.call(element, 'vFor')) {
            if (element.getAttribute('vFor') === V_FOR_EMPTY_KEY) {
                // 没有指定key
                element.setAttribute(
                    `:${attribute}`,
                    `'${identifier}${startID++}${SPLIT_IDENTIFIER}'+${startKey++}`
                );
            } else {
                // 指定了key
                element.setAttribute(
                    `:${attribute}`,
                    `'${identifier}${startID++}${SPLIT_IDENTIFIER}'+${element.vFor}`
                );
            }
            return;
        }
        element.setAttribute(attribute, `${identifier}${startID++}`);
    });

    // 获取innerHTML字符串
    const innerHTML = preserveTagCase(htmlProcessedText, serializeElement(body));
    return decodeTemplate(innerHTML);
}

/**
 * @description 去除生成的Vue文件各个模块开头的空行
 * @param {String} str 文本
 * @return {String}
 * */
function removeLeadingEmptyLines(str) {
    return str.replace(/^(?:\s*[\r\n]+|\/\/\n|\/\/\r\n)+/gm, '');
}

/**
 * @description 获取单个Vue模块模板
 * @param {Object} templateInfo 模板信息
 * @return {String}
 * */
function generateSingleVueTemplate(templateInfo) {
    if (!templateInfo) return '';
    let attr = '';
    for (const key in templateInfo.attrs) {
        attr += ` ${key}${templateInfo.attrs[key] === true ? '' : `="${templateInfo.attrs[key]}"`}`;
    }
    return `<${templateInfo.type}${attr}>\r\n${removeLeadingEmptyLines(templateInfo.content)}\r\n</${templateInfo.type}>\r\n\r\n`;
}

/**
 * @description 生成Vue模块模板
 * @param {Object} descriptor 模板对象
 * @return {String} Vue模板
 * */
function generateVueTemplate(descriptor) {
    let template = '';
    template += generateSingleVueTemplate(descriptor.template);
    template += generateSingleVueTemplate(descriptor.script);
    template += generateSingleVueTemplate(descriptor.scriptSetup);
    descriptor.styles.forEach((style) => {
        template += generateSingleVueTemplate(style);
    });
    return template;
}

function autoAddAttribute() {
    try {
        // 日志满的话，删除一半
        checkLogFull(config.logs, clearHalfFolder);

        const rootPath = path.join(__dirname, config.path);
        const rootStart = Date.now();
        dfsFile(rootPath, config.type, (filePath, source) => {
            const start = Date.now();
            const fileName = path.parse(filePath).name;
            const dirName = path.basename(path.dirname(filePath));
            let identifier = fileName;
            if (fileName.toLowerCase() === 'index' && dirName) {
                identifier = `${dirName}Index`;
            }
            const descriptor = parser.parseComponent(source, { pad: true });
            if (descriptor.template) {
                descriptor.template.content = addIdToElements(
                    descriptor.template.content,
                    config.attribute,
                    identifier
                );
                fs.writeFileSync(filePath, generateVueTemplate(descriptor));
                console.log(
                    `${filePath.replace(__dirname, '').replace(/\\/g, '/')} Finished ${Date.now() - start}ms`
                );
            }
        });
        console.log('Total: ', `${(Date.now() - rootStart) / 1000}s`);
    } catch (e) {
        logger.error(e);
    }
}

autoAddAttribute();

// const r1 = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
//
// r1.question('Press enter to exit:\t', () => {
//     r1.close();
// });
//
// r1.on('close', () => {
//     process.exit(0);
// });

// TODO: 适配下列节点
//  9: 文档节点 (DOCUMENT_NODE)
//  10: 文档类型节点 (DOCUMENT_TYPE_NODE)
//  11: 文档片段节点 (DOCUMENT_FRAGMENT_NODE)
// 写单元测试进行验证
