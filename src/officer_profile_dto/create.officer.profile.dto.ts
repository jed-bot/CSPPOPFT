export class CreateOfficerProfileDto{
    first_name:string;
    last_name:string;
    middle_name:string;
    age:number;
    sex:string;
    birthday:string;
    office_unit:string;
}

export class CreateOfficerProfileByOther{
    officer_account_id:number;
    first_name:string;
    last_name:string;
    middle_name:string;
    age:number;
    sex:string;
    birthday:string;
    office_unit:string;
}