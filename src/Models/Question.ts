export class Question {
    public title!: string;
    public type!: string;
    public nextQuestionId!: string;
    public nextContetId!: string;
    public previusQuestionId!: string;
    public previusContetId!: string;

    constructor(public id: string) { }

    getNextItem(lista: Question[], contents: Content[]): nextItem | undefined {
        if (this.nextQuestionId != null) {
            const item = lista.filter(x => x.id === this.nextQuestionId)[0]
            return {
                type: 'question',
                quest: item
            }
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (this.nextContetId != null) {
            const item = contents.filter(x => x.id === this.nextContetId)[0]
            const content = new Content(item.id)
            content.title = item.title
            content.text = item.text
            content.nextQuestionId = item.nextQuestionId
            content.nextContetId = item.nextContetId
            content.previusQuestionId = item.previusQuestionId
            content.previusContetId = item.previusContetId
            return {
                type: 'content',
                content
            }
        }
    }



    getPrevItem(lista: Question[], contents: Content[]): nextItem | undefined {
        if (this.previusQuestionId != null) {
            const item = lista.filter(x => x.id === this.previusQuestionId)[0]
            return {
                type: 'question',
                quest: item
            }
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (this.previusContetId != null) {
            const item = contents.filter(x => x.id === this.previusContetId)[0]
            const content = new Content(item.id)
            content.title = item.title
            content.text = item.text
            content.nextQuestionId = item.nextQuestionId
            content.nextContetId = item.nextContetId
            content.previusQuestionId = item.previusQuestionId
            content.previusContetId = item.previusContetId
            return {
                type: 'content',
                content
            }
        }
    }

}

export class Content {
    public title!: string;
    public text!: string;
    public nextQuestionId!: string;
    public nextContetId!: string;
    public previusQuestionId!: string;
    public previusContetId!: string;

    constructor(public id: string) { }

    getNextItem(lista: Question[], contents: Content[]): nextItem | undefined {
        if (this.nextQuestionId != null) {
            const item = lista.filter(x => x.id === this.nextQuestionId)[0]
            return {
                type: 'question',
                quest: item
            }
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (this.nextContetId != null) {
            const item = contents.filter(x => x.id === this.nextContetId)[0]
            const content = new Content(item.id)
            content.title = item.title
            content.text = item.text
            content.nextQuestionId = item.nextQuestionId
            content.nextContetId = item.nextContetId
            content.previusQuestionId = item.previusQuestionId
            content.previusContetId = item.previusContetId
            return {
                type: 'content',
                content
            }
        }
    }


    getPrevItem(lista: Question[], contents: Content[]): nextItem | undefined {
        if (this.previusQuestionId != null) {
            const item = lista.filter(x => x.id === this.previusQuestionId)[0]
            return {
                type: 'question',
                quest: item
            }
            // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (this.previusContetId != null) {
            const item = contents.filter(x => x.id === this.previusContetId)[0]
            const content = new Content(item.id)
            content.title = item.title
            content.text = item.text
            content.nextQuestionId = item.nextQuestionId
            content.nextContetId = item.nextContetId
            content.previusQuestionId = item.previusQuestionId
            content.previusContetId = item.previusContetId
            return {
                type: 'content',
                content
            }
        }
    }

}

export class ItemQuest {
    public listQuestion!: Question[]
    public listContent!: Content[]

    constructor(question: Question[],contents: Content[]){
        this.listQuestion = question
        this.listContent = contents
    }

    getFirstItem(): nextItem | undefined{
        if (this.listQuestion.filter(x => x.previusQuestionId == null && x.previusQuestionId == null).length > 0){
            return {
                type: 'question',
                quest: this.listQuestion.filter(x => x.previusQuestionId == null && x.previusQuestionId == null)[0]
            }
        // biome-ignore lint/style/noUselessElse: <explanation>
        }else{
            return{
                type: 'content',
                content: this.listContent.filter(x => x.previusContetId == null && x.previusContetId == null)[0]
            }
        }
    }
}

export type nextItem = {
    type: 'question'
    quest: Question
  } | {
    type: 'content'
    content: Content
  }