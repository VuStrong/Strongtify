import { Injectable } from "@nestjs/common";

@Injectable()
export class StringService {
    random(length: number) {
        const chars =
            "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
        const charsLength = chars.length;

        const randomArray = Array.from(
            { length },
            () => chars[Math.floor(Math.random() * charsLength)],
        );

        const randomString = randomArray.join("");
        return randomString;
    }

    /**
     * Convert string to lowercase dashed string
     **/
    slug(value: string) {
        if (!value) return undefined;

        value = value.trim().toLowerCase();

        value = value.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
        value = value.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
        value = value.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
        value = value.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
        value = value.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
        value = value.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
        value = value.replace(/đ/gi, "d");
        value = value.replace(
            /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
            "",
        );

        return value.replace(/\s+/g, "-");
    }
}
