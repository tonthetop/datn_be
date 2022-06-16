
function convertUTCDateToLocalDate(date:any) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
}
export {convertUTCDateToLocalDate}