"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import { Account as AccountType } from "@/types/user";
import { deleteAccount, updateAccountState } from "@/services/api/accounts";
import Modal from "@/components/modals/Modal";
import DeleteConfirmContent from "@/components/modals/modal-contents/DeleteConfirmContent";
import Button from "@/components/buttons/Button";

export default function Account({ account }: { account: AccountType }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const { data: session } = useSession();

    const onClickLock = useCallback(
        async (locked: boolean) => {
            setIsLoading(true);

            try {
                await updateAccountState(
                    account.id,
                    { locked },
                    session?.accessToken ?? "",
                );

                toast.success(`Account updated`);
                router.refresh();
            } catch (error: any) {
                toast.error(error.message);
            }

            setIsLoading(false);
        },
        [session],
    );

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        setIsModalOpen(false);

        try {
            await deleteAccount(account.id, session?.accessToken ?? "");

            router.push("/admin/users");
            toast.success(`Account deleted`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    }, [session]);

    return (
        <div className="flex flex-col gap-3">
            <div className="text-yellow-50 mb-3">
                <h4 className="text-2xl">Information: </h4>
                <div>
                    {" "}
                    - Name: <strong>{account.name}</strong>
                </div>
                <div>
                    {" "}
                    - Email: <strong>{account.email}</strong>
                </div>
                <div>
                    {" "}
                    - Join At: <strong>{account.createdAt}</strong>
                </div>
                <div>
                    {" "}
                    - Role: <strong>{account.role}</strong>
                </div>
            </div>

            {account.locked ? (
                <div className="w-fit">
                    <div className="text-yellow-50 text-lg">
                        This user is locked
                    </div>
                    <Button
                        disabled={isLoading}
                        label={
                            isLoading ? (
                                <BeatLoader color="#121212" />
                            ) : (
                                "Unlock"
                            )
                        }
                        onClick={() => {
                            onClickLock(false);
                        }}
                    />
                </div>
            ) : (
                <div className="w-fit">
                    <Button
                        disabled={isLoading}
                        label={
                            isLoading ? (
                                <BeatLoader color="#121212" />
                            ) : (
                                "Lock this user"
                            )
                        }
                        onClick={() => {
                            onClickLock(true);
                        }}
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClickClose={() => {
                    setIsModalOpen(false);
                }}
                actionButton={
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                        Xóa
                    </button>
                }
            >
                <DeleteConfirmContent
                    title="Xóa account này?"
                    body="Bạn có chắc muốn xóa account này không?"
                />
            </Modal>

            <form className="flex flex-col gap-3">
                <div className="flex gap-x-3">
                    <Button
                        type="button"
                        bgType="error"
                        disabled={isLoading}
                        label={"Delete this account"}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </form>
        </div>
    );
}
