/**
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-11-08 09:41:47
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-05 14:17:01
 * @FilePath: .cz-config.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
module.exports = {
    // 可选类型
    types: [
        {
            value: 'feat',
            name: '✨  feat: 新的功能点、新的需求',
        },
        {
            value: 'docs',
            name: '📝 docs: 刚刚修改了文档：注释、README.md等',
        },
        {
            value: 'style',
            name: '💄 style: 不影响代码功能的修改：css样式、代码格式、eslint问题修复等',
        },
        {
            value: 'fix',
            name: '🐛 fix: 问题修复',
        },
        {
            value: 'perf',
            name: '⚡️ perf: 性能优化',
        },
        {
            value: 'refactor',
            name: '♻️ refactor: 重构 (既不增加feature, 也不是修复bug)',
        },
        {
            value: 'test',
            name: '✅  test: 测试代码',
        },
        {
            value: 'build',
            name: '🚀 build: 影响构建系统或外部依赖项的更改：build、package.json等',
        },
        {
            value: 'ci',
            name: '🔧 ci: 构建过程或辅助工具的变动',
        },
        {
            value: 'revert',
            name: '⏪  revert: 代码回滚',
        },
        {
            value: 'other',
            name: '🔧 other: 除以上所有类型外的其他提交',
        },
    ],
    scopes: [
        { name: 'leetcode' },
        { name: 'javascript' },
        { name: 'typescript' },
        { name: 'Vue' },
        { name: 'node' },
    ],
    // 步骤
    messages: {
        type: '选择一种你的提交类型:',
        scope: '选择一个scope (可选):',
        // used if allowCustomScopes is true
        customScope: 'Denote the SCOPE of this change:',
        subject: '短说明:\n',
        body: '长说明，使用"|"换行(可选)：\n',
        breaking: '非兼容性说明 (可选):\n',
        footer: '关联关闭的issue，例如：#31, #34(可选):\n',
        confirmCommit: '确定提交说明?(yes/no)',
    },
    allowCustomScopes: true,
    allowBreakingChanges: ['特性', '修复'],
    // limit subject length
    subjectLimit: 100,
};
