import { NO_IMAGE_URL } from "@/libs/constants";
import { getDashboardData } from "@/services/api/dashboard";
import getUserSession from "@/services/getUserSession";
import type { Metadata } from "next";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { MdPlaylistAddCheck } from "react-icons/md";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default async function AdminPage() {
    const session = await getUserSession();
    const dashboardData = await getDashboardData(session?.accessToken ?? "");

    if (!dashboardData) {
        return (
            <section className="text-white">
                <h1 className="text-primary text-3xl mb-5">
                    Trang này đang trong quá trình xây dựng
                </h1>

                <Image
                    src={"/img/under-construction.jpg"}
                    width={1000}
                    height={500}
                    className="w-full md:h-[500px] object-cover"
                    alt="img"
                />
            </section>
        );
    }

    return (
        <div>
            <h1 className="text-primary text-3xl mb-5">Admin Dashboard</h1>

            <div className="my-8">
                <section
                    className={`grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-4 sm:px-8`}
                >
                    <div className="flex items-center border border-darkgray bg-darkgray rounded-sm overflow-hidden shadow">
                        <div className="p-4 bg-green-500">
                            <FaUser size={30} />
                        </div>
                        <div className="px-4 text-yellow-50">
                            <h3 className="text-sm tracking-wider">New User</h3>
                            <p className="text-3xl">
                                {dashboardData.newUserTodayCount}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center border border-darkgray bg-darkgray rounded-sm overflow-hidden shadow">
                        <div className="p-4 bg-error">
                            <MdPlaylistAddCheck size={30} />
                        </div>
                        <div className="px-4 text-yellow-50">
                            <h3 className="text-sm tracking-wider">
                                New Playlist
                            </h3>
                            <p className="text-3xl">
                                {dashboardData.newPlaylistTodayCount}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="my-10">
                <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                    Recent listens
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-black bg-primary uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    User ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    IP
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentListens.map((listen, index) => (
                                <tr
                                    key={`${index}`}
                                    className="bg-darkgray border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <th
                                        scope="row"
                                        className="p-2 font-medium whitespace-nowrap"
                                    >
                                        <Image
                                            src={listen.song.imageUrl ?? NO_IMAGE_URL}
                                            style={{
                                                width: "50px",
                                                height: "auto",
                                            }}
                                            width={50}
                                            height={50}
                                            alt="song"
                                        />
                                    </th>
                                    <td className="px-6 py-4 whitespace-nowrap">{listen.song.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                                            {listen.at.toString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{listen.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{listen.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
