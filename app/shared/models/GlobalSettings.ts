export const GlobalSettings = {
    APIKey: 'DealboxClient_APIKey',
    SecretKey: 'DealboxClient_APIKey',

    //Date Format
    CommonDateFormat: "dd/MM/yyyy",
    DateFormat: "dd-MMM-yyyy",
    MonthFormat: "MMM-yyyy",
    CalendarDateFormat: "yyyy-MM-dd",
    TimeFormat: "hh:mm tt",
    DateTimeFormat: "dd-MMM-yyyy hh:mm tt",

    //Grid Settings
    PageSize: 10,

    //Input Settings
    PhoneNumberMask: "00000-00000",
    AlphaNumericPattern: "[A-Za-z0-9 ]*",
    OnlyCharactersPattern: "[A-Za-z ]*",
    OnlyNumbersPattern: "[0-9/-]*",
    MobileNumberPattern: "^[6-9]\d{9}$",
    WebsitePattern: "^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$",
    EmailPattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //File Validation
    InvalidFileTypeMessage: "Invalid file type",

}