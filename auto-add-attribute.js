/**
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-12-04 09:03:09
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-05 14:36:03
 * @FilePath: auto-add-attribute.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */


const fs = require('fs');
const parser = require('vue-template-compiler');
const {JSDOM} = require('jsdom');
const path = require('path');
const log4js = require('log4js');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, './attribute.config.json'), 'utf8'));
const V_FOR_EMPTY_KEY = 'EMPTY_KEY';
const SPLIT_IDENTIFIER = '_';
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
                pattern: '%d %p %m'
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyy-MM-dd',
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true
        },
    },
    categories: {
        // 设置默认的 categories
        default: {appenders: ['cheese'], level: 'debug'},
    }
});

function autoAddAttribute() {
    try {
        // 日志满的话，删除一半
        checkLogFull(config.logs, clearHalfFolder);
        
        dfsFile(path.join(__dirname, config.path), config.type, (filePath, source) => {
            const start = Date.now();
            const fileName = path.parse(filePath).name;
            const descriptor = parser.parseComponent(source, {pad: true});
            if (descriptor.template) {
                descriptor.template.content = addIdToElements(descriptor.template.content, config.attribute, fileName);
                const templateRegex = /<template\s*[^>]*>[\s\S]*<\/template>/;
                const generatedSource = source.replace(templateRegex, `<template>\n${descriptor.template.content}\n</template>`);
                fs.writeFileSync(filePath, generatedSource);
            }
            const duration = Date.now() - start;
            console.log(`${filePath.replace(__dirname, '').replaceAll('\\', '/')} Finished ${duration}ms`);
        });
    } catch (e) {
        logger.error(e);
    }
}

autoAddAttribute();


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
 * @description 获取文件夹大小
 * @param {String} folderPath 文件夹路径
 * @param {Function} errHandler 错误处理函数
 * @returns禁止
 */
function getFolderSize(folderPath, errHandler) {
    let totalSize = 0;
    try {
        const fileNames = fs.readdirSync(folderPath);
        fileNames.forEach(fileName => {
            const filePath = path.join(folderPath, fileName);
            totalSize += fs.statSync(filePath).size;
        });
    } catch (err) {
        errHandler && errHandler(err);
    }
    return totalSize;
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
        halfFileNames.forEach(fileName => {
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
        fileNames.forEach(name => {
            dfsFile(path.join(filePath, name), extendName, handler);
        });
    }
}

/**
 * @description 判断是否为template节点
 * @param {HTMLElement} node HTML节点
 * @return {Boolean}
 * */
function isTemlateNode(node) {
    return node.tagName.toLowerCase() === 'template';
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
function handleVForNode(element) {
    if (element.hasAttribute('v-for')) {
        const vForNodeList = isTemlateNode(element) ? element.content.querySelectorAll('*') : element.querySelectorAll('*');
        const vForNodes = [element, ...vForNodeList];
        const key = getVForKey(vForNodes);
        vForNodes.forEach(vForNode => {
            if (!isTemlateNode(vForNode)) {
                vForNode.vFor = key;
            }
        });
    }
}

/**
 * @description 获取指定节点下所有子节点（包含嵌套的template）
 * @param {HTMLElement} root DOM 节点
 * @return {Array} nodeList 子节点数组
 * */
function getAllChildNodes(root) {
    const dfsTemplate = (node) => {
        const elements = node.querySelectorAll('*');
        elements.forEach(element => {
            // 处理v-for节点
            handleVForNode(element);
            if (isTemlateNode(element)) {
                dfsTemplate(element.content);
            } else {
                nodeList.push(element);
            }
        });
    };
    const nodeList = [];
    dfsTemplate(root);
    return nodeList;
}

/**
 * @description 根据标签名判断是否是标准HTML节点
 * @param {String} tagName 标签名
 * @return {Boolean}
 * */
function isStandardHTMLTag(tagName = '') {
    // 定义常见的 HTML 标签名列表
    const htmlTagPattern = /^(?:a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|autoAddAttribute|map|mark|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)$/i;
    return htmlTagPattern.test(tagName.toLowerCase());
}

/**
 * @description 给指定HTML文本 节点下所有子节点批量添加属性
 * @param {String} htmlText html文本
 * @param {String} identifier 自增属性标识符
 * @param {String} attribute 属性名
 * @return {String} 添加之后的HTML文本
 * */
function addIdToElements(htmlText, attribute = 'id', identifier) {
    const root = new JSDOM(htmlText);
    const body = root.window.document.body;
    const elements = getAllChildNodes(body);
    let {startID, startKey} = getStartIDFromElements(elements, identifier, attribute);
    
    elements.forEach(element => {
        // 如果存在id和:id
        if (element.hasAttribute(attribute) || element.hasAttribute(`:${attribute}`)) {
            return;
        }
        // 被v-for的节点
        if (element.hasOwnProperty('vFor')) {
            if (element.getAttribute('vFor') === V_FOR_EMPTY_KEY) {
                // 没有指定key
                element.setAttribute(`:${attribute}`, `'${identifier}${startID++}${SPLIT_IDENTIFIER}'+${startKey++}`);
            } else {
                // 指定了key
                element.setAttribute(`:${attribute}`, `'${identifier}${startID++}${SPLIT_IDENTIFIER}'+${element.vFor}`);
            }
            return;
        }
        element.setAttribute(attribute, `${identifier}${startID++}`);
    });
    return body.innerHTML;
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
    elements.forEach(element => {
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
