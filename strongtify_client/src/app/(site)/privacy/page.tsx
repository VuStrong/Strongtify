import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chính sách riêng tư | Strongtify",
};

export default async function Privacy() {
    return (
        <section className="bg-white rounded-lg p-5">
            <h1 className="text-black text-3xl font-semibold mb-5">
                Chính sách riêng tư
            </h1>

            <div className="flex flex-col gap-5">
                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        Cookies
                    </h5>
                    <p className="text-gray-600">
                        Cũng như nhiều website khác, chúng tôi thiết lập và sử
                        dụng cookie để tìm hiểu thêm về cách bạn tương tác với
                        nội dung của chúng tôi và giúp chúng tôi cải thiện trải
                        nghiệm của bạn khi ghé thăm website của chúng tôi, cũng
                        như duy trì thiết lập cá nhân của bạn... Website của
                        chúng tôi có thể đăng quảng cáo, và trong trường hợp đó
                        có thể thiết lập và truy cập các cookie trên máy tính
                        của bạn và phụ thuộc vào chính sách bảo vệ sự riêng tư
                        của các bên cung cấp quảng cáo. Tuy nhiên, các công ty
                        quảng cáo không được truy cập vào cookie của chúng tôi.
                        Những công ty đó thường sử dụng các đoạn mã riêng để
                        theo dõi số lượt truy cập của bạn đến website của chúng
                        tôi.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        Thay đổi điều khoản
                    </h5>
                    <p className="text-gray-600">
                        Chúng tôi có thể thay đổi các điều khoản của bản Chính
                        sách bảo vệ riêng tư này cho phù hợp với điều kiện thực
                        tế. Chúng tôi sẽ thông báo về những thay đổi lớn bằng
                        cách đặt thông báo trên site của chúng tôi và được đặt
                        trong thiết lập người dùng của bạn.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        Từ chối bảo đảm
                    </h5>
                    <p className="text-gray-600">
                        Mặc dù Chính sách bảo vệ riêng tư đặt ra những tiêu
                        chuẩn về Dữ liệu và chúng tôi luôn cố gắng hết mình để
                        đáp ứng, chúng tôi không bị buộc phải bảo đảm những tiêu
                        chuẩn đó. Có thể có những nhân tố vượt ra ngoài tầm kiểm
                        soát của chúng tôi có thể dẫn đến việc Dữ liệu bị tiết
                        lộ. Vì thế, chúng tôi không chịu trách nhiệm bảo đảm Dữ
                        liệu luôn được duy trì ở tình trạng hoàn hảo hoặc không
                        bị tiết lộ.
                    </p>
                </div>

                <div>
                    <h5 className="text-black text-lg font-medium mb-2">
                        Sự đồng ý của bạn
                    </h5>
                    <p className="text-gray-600">
                        Khi sử dụng dịch vụ của Strongtify, bạn mặc nhiên chấp
                        nhận điều khoản trong Chính sách bảo vệ riêng tư này
                    </p>
                </div>
            </div>
        </section>
    );
}
