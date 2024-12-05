/**
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-11-06 14:13:47
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-05 20:01:50
 * @FilePath: eslint.config.mjs
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
    {
        name: 'app/files-to-ignore',
        ignores: [
            '**/dist/**',
            '**/dist-ssr/**',
            '**/coverage/**',
            '**/node_modules/**',
            '**/logs/**',
            '**/docs/**',
            'pnpm-lock.yaml',
        ],
    },
    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    skipFormatting,
    {
        files: ['*.js', '*.mjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // 添加 Node.js 全局变量
                require: 'readonly',
                module: 'readonly',
                exports: 'writable',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                setImmediate: 'readonly',
                clearImmediate: 'readonly',
            },
        },
    },
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,mjs,jsx,vue}'],
        rules: {
            'vue/require-default-prop': 'off',
            'vue/multi-word-component-names': 'off',
            'no-unused-vars': 2,
            'vue/no-unused-components': 2,
            'no-mixed-spaces-and-tabs': 1,
            'no-alert': 1, //禁止使用alert confirm prompt
            'no-array-constructor': 0, //禁止使用数组构造器
            'no-bitwise': 0, //禁止使用按位运算符
            'no-caller': 0, //禁止使用arguments.caller或arguments.callee
            'no-class-assign': 2, //禁止给类赋值
            'no-cond-assign': 2, //禁止在条件表达式中使用赋值语句
            'no-const-assign': 2, //禁止修改const声明的变量
            'no-constant-condition': 2, //禁止在条件中使用常量表达式 if(true) if(1)
            'no-continue': 0, //禁止使用continue
            'no-control-regex': 2, //禁止在正则表达式中使用控制字符
            'no-debugger': 0, //禁止使用debugger
            'no-delete-var': 2, //不能对var声明的变量使用delete操作符
            'no-div-regex': 1, //不能使用看起来像除法的正则表达式/=foo/
            'no-dupe-keys': 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
            'no-dupe-args': 2, //函数参数不能重复
            'no-duplicate-case': 2, //switch中的case标签不能重复
            'no-else-return': 1, //如果if语句里面有return,后面不能跟else语句
            'no-empty': 2, //块语句中的内容不能为空
            'no-empty-character-class': 2, //正则表达式中的[]内容不能为空
            'no-eq-null': 2, //禁止对null使用==或!=运算符
            'no-eval': 1, //禁止使用eval
            'no-ex-assign': 2, //禁止给catch语句中的异常参数赋值
            'no-extend-native': 2, //禁止扩展native对象
            'no-extra-bind': 1, //禁止不必要的函数绑定
            'no-extra-boolean-cast': 2, //禁止不必要的bool转换
            'no-extra-semi': 2, //禁止多余的分号
            'no-fallthrough': 2, //禁止switch穿透
            'no-floating-decimal': 2, //禁止省略浮点数中的0 .5 3.
            'no-func-assign': 2, //禁止重复的函数声明
            'no-implicit-coercion': 2, //禁止隐式转换
            'no-implied-eval': 2, //禁止使用隐式eval
            'no-inline-comments': 0, //禁止行内备注
            'no-inner-declarations': [2, 'functions'], //禁止在块语句中使用声明（变量或函数）
            'no-invalid-regexp': 2, //禁止无效的正则表达式
            'no-invalid-this': 2, //禁止无效的this，只能用在构造器，类，对象字面量
            'no-irregular-whitespace': 0, //不能有不规则的空格
            'no-iterator': 2, //禁止使用__iterator__ 属性
            'no-label-var': 2, //label名不能与var声明的变量名相同
            'no-labels': 2, //禁止标签声明
            'no-lone-blocks': 2, //禁止不必要的嵌套块
            'no-lonely-if': 2, //禁止else语句内只有if语句
            'no-loop-func': 1, //禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
            'linebreak-style': [0, 'windows'], //换行风格
            'no-multi-str': 2, //字符串不能用\换行
            'no-multiple-empty-lines': [1, { max: 2 }], //空行最多不能超过2行
            'no-nested-ternary': 0, //禁止使用嵌套的三目运算
            'no-octal': 2, //禁止使用八进制数字
            'no-octal-escape': 2, //禁止使用八进制转义序列
            'no-param-reassign': 2, //禁止给参数重新赋值
            'no-path-concat': 0, //node中不能使用__dirname或__filename做路径拼接
            'no-plusplus': 0, //禁止使用++，--
            'no-process-env': 0, //禁止使用process.env
            'no-process-exit': 0, //禁止使用process.exit()
            'no-redeclare': 2, //禁止重复声明变量
            'no-restricted-modules': 0, //如果禁用了指定模块，使用就会报错
            'no-return-assign': 0, //return 语句中不能有赋值表达式
            'no-script-url': 0, //禁止使用javascript:void(0)
            'no-self-compare': 2, //不能比较自身
            'no-sequences': 0, //禁止使用逗号运算符
            'no-shadow': 1, //外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
            'no-spaced-func': 0, //函数调用时 函数名与()之间不能有空格
            'no-sparse-arrays': 0, //禁止稀疏数组， [1,,2]
            'no-sync': 0, //nodejs 禁止同步方法
            'no-ternary': 0, //禁止使用三目运算符
            'no-trailing-spaces': 0, //一行结束后面不要有空格
            'no-this-before-super': 0, //在调用super()之前不能使用this或super
            'no-undef': 2, //不能有未定义的变量
            'no-undef-init': 2, //变量初始化时不能直接给它赋值为undefined
            'no-undefined': 2, //不能使用undefined
            'no-unreachable': 2, //不能有无法执行的代码
            'no-use-before-define': 2, //未定义前不能使用
            'no-useless-call': 1, //禁止不必要的call和apply
            'no-void': 2, //禁用void操作符
            'no-var': 1, //禁用var，用let和const代替
            'default-case': 2, //switch语句最后必须有default
            'init-declarations': 0, //声明时必须赋初值
            'max-len': [0, 100, 4], //字符串最大长度
            quotes: [1, 'single'], //引号类型 `` "" ''
            'id-match': 1, //命名检测
            semi: [1, 'always'], //语句强制分号结尾
            'space-in-parens': [0, 'never'], //小括号里面要不要有空格
        },
    },
];
