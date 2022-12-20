import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    HomeIcon,
    GlobeAltIcon,
    PlusCircleIcon
} from "@heroicons/react/24/outline";

import { selectCurrentUser } from "../features/user/userSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import useUserImage from "../hooks/useUserImage";
import classNames from "../hooks/useClassNames";

const Navbar = () => {
    const currentUser = useSelector(selectCurrentUser);
    const userImage = useUserImage();

    const [searchQuery, setSearchQuery] = useState("");
    const onSearchQueryChanged = (e) => setSearchQuery(e.target.value);

    const [logout] = useLogoutMutation();

    const handleLogout = async (e) => {
        console.log("handleLogout");
        await logout();
    };

    return (
        <Disclosure className="sticky top-0 z-10 bg-white shadow-sm" as="nav">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-3">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* <div className="relative inset-y-0 left-0 mr-6 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                    {open ? (
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div> */}
                            {/* <div className="flex flex-1 items-center"> */}
                            <div className="mr-3 flex flex-shrink-0 items-center">
                                <Link className="p-1 focus:outline-none" to="/">
                                    <h1 className="text-3xl font-semibold text-gray-900">Memories</h1>
                                </Link>
                            </div>
                            {/* <div className="hidden rounded-md border border-gray-300 px-2 py-1 text-sm focus-within:outline-none sm:mx-auto sm:flex sm:items-center">
                                    <label className="flex items-center" htmlFor="search">
                                        <MagnifyingGlassIcon className="h-5 w-5 stroke-gray-700" />
                                        <input
                                            className="px-2 text-gray-700 focus:outline-none"
                                            id="search"
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={onSearchQueryChanged}
                                        />
                                    </label>
                                </div> */}
                            {/* </div> */}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div className="flex items-center justify-between space-x-3">
                                    <Link
                                        className="rounded-md p-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                                        to="/"
                                    >
                                        <HomeIcon className="h-6 w-6" aria-hidden="true" />
                                    </Link>
                                    <Link
                                        className="rounded-md p-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                                        to="/post/create"
                                    >
                                        <PlusCircleIcon className="h-6 w-6" aria-hidden="true" />
                                    </Link>
                                    <Link
                                        className="rounded-md p-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                                        to="/explore"
                                    >
                                        <GlobeAltIcon className="h-6 w-6" aria-hidden="true" />
                                    </Link>
                                </div>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-5">
                                    <Menu.Button className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                                        <img className="h-8 w-8 rounded-full" src={userImage} alt="" />
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={`/user/${currentUser._id}`}
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-3 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/user/settings"
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-3 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Settings
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <div
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block cursor-pointer px-3 py-2 text-sm text-gray-700"
                                                        )}
                                                        onClick={handleLogout}
                                                    >
                                                        Log out
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* <Disclosure.Panel className="flex h-12 items-center justify-center px-2 sm:hidden">
                        <div className="flex items-center rounded-md border border-gray-300 px-2 py-1 text-sm focus-within:outline-none">
                            <label className="flex items-center" htmlFor="search-xs">
                                <MagnifyingGlassIcon className="h-5 w-5 stroke-gray-500" />
                                <input
                                    className="px-2 text-gray-700 focus:outline-none"
                                    id="search-xs"
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={onSearchQueryChanged}
                                />
                            </label>
                        </div>
                    </Disclosure.Panel> */}
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;
