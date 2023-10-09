import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Khiếu nại bản quyền | Strongtify",
};

export default async function License() {
    return (
        <section className="bg-white rounded-lg p-5">
            <h1 className="text-black text-3xl font-semibold mb-5">
                Khiếu nại bản quyền
            </h1>

            <div className="flex flex-col gap-5">
                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        1. Trách nhiệm nội dung
                    </h5>
                    <p className="text-gray-600">
                        Nội dung trên Strongtify được đăng bởi người sử dụng, vì
                        vậy trách nhiệm về nội dung thuộc về người gửi bài lên
                        trên hệ thống. Ban quản trị của trang web sẽ thường
                        xuyên kiểm tra các nội dung trên trang và loại bỏ các
                        nội dung vi phạm bản quyền, nội dung quảng cáo, spam,
                        clip rác, nội dung xúc phạm, 18+ hay những nội dung
                        không phù hợp với thuần phong mỹ tục, không trái với các
                        quy định pháp luật.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        2. Bản quyền
                    </h5>
                    <p className="text-gray-600">
                        Là một trang web về thông tin giải trí, nhưng chúng tôi
                        không cam kết chắc chắn rằng có thể kiểm soát mọi thông
                        tin trên trang web. Bất kỳ hành vi xâm phạm đến bản
                        quyền nào nếu được báo cáo sẽ bị Ban quản trị gỡ bỏ khỏi
                        trang web trong thời gian sớm nhất.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        3. Sở hữu trí tuệ
                    </h5>
                    <p className="text-gray-600">
                        Mọi nội dung được đăng tải trên Strongtify, bao gồm
                        thiết kế, logo, các phần mềm, chức năng kỹ thuật, cấu
                        trúc trang đều thuộc bản quyền của Strongtify . Nghiêm
                        cấm mọi sao chép, sửa đổi, trưng bày, phân phát, chuyển
                        tải, tái sử dụng, xuất bản, bán, cấp phép, tái tạo hay
                        sử dụng bất cứ nội dung nào của trang web cho bất kỳ mục
                        đích nào mà không có sự xác nhận của Ban quản trị
                        Strongtify.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        4. Quy trình báo cáo vi phạm bản quyền
                    </h5>
                    <p className="text-gray-600">
                        Nếu bạn tin rằng bất kỳ nội dung nào được phát hành
                        thông qua Strongtify vi phạm quyền sở hữu trí tuệ của
                        bạn, vui lòng thông báo cho chúng tôi về việc vi phạm
                        bản quyền qua Email{" "}
                        <span className="text-black underline">
                            strongtify@gmail.com
                        </span>
                        . Chúng tôi sẽ xử lý từng thông báo vi phạm bản quyền mà
                        chúng tôi nhận được theo quy định của Điều khoản sử dụng
                        của Strongtify và quy định của pháp luật sở hữu trí tuệ.
                    </p>
                </div>
            </div>
        </section>
    );
}
