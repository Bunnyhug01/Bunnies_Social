export default function firstLetterToUppercase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}