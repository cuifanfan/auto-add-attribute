<script setup>
import WelcomeItem from './WelcomeItem.vue';
import DocumentationIcon from './icons/IconDocumentation.vue';
import ToolingIcon from './icons/IconTooling.vue';
import EcosystemIcon from './icons/IconEcosystem.vue';
import CommunityIcon from './icons/IconCommunity.vue';
import SupportIcon from './icons/IconSupport.vue';
</script>

<template>
    <WelcomeItem id="Test1">
        <div id="HelloWorldIndex1"></div>
        <template v-for="item in 8" :key="item">
            <span :id="'Test2_' + item">1</span>
            <span :id="'Test3_' + item">1</span>
            <span :id="'Test4_' + item">1</span>
        </template>

        <template v-for="item in 8" :key="item">
            <span :id="'Test5_' + item">1</span>
            <span :id="'Test6_' + item">1</span>
            <span :id="'Test7_' + item">1</span>
        </template>
        <template #icon=""> <DocumentationIcon id="Test8"> </DocumentationIcon></template>
        <template #heading="">Documentation</template>

        Vue’s
        <a href="https://vuejs.org/" target="_blank" rel="noopener" id="Test9"
            >official documentation</a
        >
        provides you with all information you need to get started.
    </WelcomeItem>

    <WelcomeItem id="Test10">
        <template #icon=""> <ToolingIcon id="Test11"> </ToolingIcon></template>
        <template #heading="">Tooling</template>

        This project is served and bundled with
        <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener" id="Test12"
            >Vite</a
        >. The recommended IDE setup is
        <a href="https://code.visualstudio.com/" target="_blank" rel="noopener" id="Test13"
            >VSCode</a
        >
        +
        <a href="https://github.com/johnsoncodehk/volar" target="_blank" rel="noopener" id="Test14"
            >Volar</a
        >. If you need to test your components and web pages, check out
        <a href="https://www.cypress.io/" target="_blank" rel="noopener" id="Test15">Cypress</a>
        and
        <a href="https://on.cypress.io/component" target="_blank" rel="noopener" id="Test16"
            >Cypress Component Testing</a
        >.

        <br id="Test17" />

        More instructions are available in <code id="Test18">README.md</code>.
    </WelcomeItem>

    <WelcomeItem id="Test19">
        <template #icon=""> <EcosystemIcon id="Test20"> </EcosystemIcon></template>
        <template #heading="">Ecosystem</template>

        Get official tools and libraries for your project:
        <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener" id="Test21">Pinia</a>,
        <a href="https://router.vuejs.org/" target="_blank" rel="noopener" id="Test22">Vue Router</a
        >,
        <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener" id="Test23"
            >Vue Test Utils</a
        >, and
        <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener" id="Test24"
            >Vue Dev Tools</a
        >. If you need more resources, we suggest paying
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" id="Test25"
            >Awesome Vue</a
        >
        a visit.
    </WelcomeItem>

    <WelcomeItem id="Test26">
        <template #icon=""> <CommunityIcon id="Test27"> </CommunityIcon></template>
        <template #heading="">Community</template>

        Got stuck? Ask your question on
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener" id="Test28">Vue Land</a>,
        our official Discord server, or
        <a
            href="https://stackoverflow.com/questions/tagged/vue.js"
            target="_blank"
            rel="noopener"
            id="Test29"
            >StackOverflow</a
        >. You should also subscribe to
        <a href="https://news.vuejs.org" target="_blank" rel="noopener" id="Test30"
            >our mailing list</a
        >
        and follow the official
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener" id="Test31">@vuejs</a>
        twitter account for latest news in the Vue world.
    </WelcomeItem>

    <WelcomeItem id="Test32">
        <template #icon=""> <SupportIcon id="Test33"> </SupportIcon></template>
        <template #heading="">Support Vue</template>

        As an independent project, Vue relies on community backing for its sustainability. You can
        help us by
        <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener" id="Test34"
            >becoming a sponsor</a
        >.
    </WelcomeItem>
</template>
