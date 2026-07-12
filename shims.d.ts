declare module 'markdown-it' {
  interface Options {
    html?: boolean
    xhtmlOut?: boolean
    breaks?: boolean
    langPrefix?: string
    linkify?: boolean
    typographer?: boolean
    quotes?: string
  }

  class MarkdownIt {
    constructor(presetName?: string | Options, options?: Options)
    render(src: string, env?: Record<string, unknown>): string
  }

  export = MarkdownIt
}
