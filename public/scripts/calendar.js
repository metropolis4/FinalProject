module.exports = {
    format: function(date){
        dateArray = date.split('-');
        var schDateYear = dateArray[0];
        var schDateDay = dateArray[2];
        Number(schDateDay) < 10 ? schDateDay = schDateDay.charAt(1) : schDateDay = schDateDay;
        var schDateMonth = dateArray[1];
        switch(schDateMonth) {
            case '01':
                schDateMonth = 'January';
                break;
            case '02':
                schDateMonth = 'February';
                break;
            case '03':
                schDateMonth = 'March';
                break;
            case '04':
                schDateMonth = 'April';
                break;
            case '05':
                schDateMonth = 'May';
                break;
            case '06':
                schDateMonth = 'June';
                break;
            case '07':
                schDateMonth = 'July';
                break;
            case '08':
                schDateMonth = 'August';
                break;
            case '09':
                schDateMonth = 'September';
                break;
            case '10':
                schDateMonth = 'October';
                break;
            case '11':
                schDateMonth = 'November';
                break;
            default:
                schDateMonth = 'December';
                break;
        }
        return [schDateMonth, schDateDay, schDateYear];
        }
    };