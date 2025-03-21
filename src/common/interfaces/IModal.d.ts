export interface IModal {
    content: string,
    isOpen: boolean,
    onClose: () => any,
    fetchDataAgain: () => any,
    titleToChange?: string,
    bgColorToChange?: string,
    id?: string,
    numberOfLists?: number,
    numberOfCards?: number,
    listid?: string
}