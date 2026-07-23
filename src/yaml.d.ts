declare module '*.yaml' {
    const data: unknown // deliberately unknown: forces everything through Zod
    export default data
}
