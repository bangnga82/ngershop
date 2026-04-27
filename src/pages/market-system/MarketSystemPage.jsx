import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../components/commons/layout/Layout";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoStorefront } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaClock } from "react-icons/fa6";
import { locationData } from "../../components/martket-system/dataLocation";
import FilterLocation from "../../components/martket-system/FilterLocation";
import LocationDiamondGrid from "../../components/martket-system/LocationDiamondGrid";
const MarketSystemPage = () => {
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [districts, setDistricts] = useState([]);
    const [locations, setLocations] = useState([]);

    const getAllLocations = useCallback(() => {
        let allLocations = [];
        Object.values(locationData).forEach((province) => {
            Object.values(province.districts).forEach((district) => {
                allLocations = [...allLocations, ...district.locations];
            });
        });
        setLocations(allLocations);
    }, []);

    useEffect(() => {
        getAllLocations();
    }, [getAllLocations]);

    const updateDistricts = useCallback(() => {
        if (selectedProvince) {
            const provinceData = locationData[selectedProvince];
            if (provinceData) {
                const districtOptions = Object.entries(
                    provinceData.districts
                ).map(([key, district]) => ({
                    value: key,
                    name: district.name,
                }));
                setDistricts(districtOptions);
                // Reset selected district
                setSelectedDistrict("");

                // Update locations to show all in the province
                let allLocations = [];
                 Object.values(provinceData.districts).forEach((district) => {
                     allLocations = [...allLocations, ...district.locations];
                 });
                 setLocations(allLocations);
             }
         } else {
             // Reset districts and show all locations
             setDistricts([]);
             getAllLocations();
         }
    }, [getAllLocations, selectedProvince]);

    useEffect(() => {
        updateDistricts();
    }, [updateDistricts]);

    const updateLocations = useCallback(() => {
        if (selectedProvince && selectedDistrict) {
          const provinceData = locationData[selectedProvince];
          const districtData = provinceData?.districts[selectedDistrict];
          
          if (districtData) {
            setLocations(districtData.locations);
          }
        }
        
      }, [selectedDistrict, selectedProvince]);
      // Update locations when district changes
      useEffect(() => {
        updateLocations();
      }, [updateLocations]);

    const navigate = useNavigate();
    const MotionDiv = motion.div;
    return (
        <Layout>
            <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className=" pt-[20px] flex justify-center items-center mb-10 "
            >
                <div className="container w-[84%]">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <span
                                onClick={() => navigate("/")}
                                className="cursor-pointer hover:text-[color:var(--accent-hover)] duration-200"
                            >
                                Trang chủ
                            </span>
                            <FaChevronRight
                                size={12}
                                className="inline-block"
                            />
                            <p className="font-bold text-[color:var(--accent)]">
                                Hệ thống cửa hàng
                            </p>
                        </div>
                        {/*  */}
                        <div className=" border-2 border-[color:var(--accent)] p-5 rounded-2xl mb-5">
                            <div className="flex flex-col justify-around items-start gap-5 lg:item-start lg:flex-row ">
                                <div className="flex gap-3 items-center">
                                    <div className=" rounded-full p-4 bg-[color:var(--accent)]">
                                        <IoStorefront
                                            size={30}
                                            color="#ffffff"
                                        />
                                    </div>
                                    <div className="flex flex-col font-normal">
                                        <span>Hệ thống 3 cửa hàng</span>
                                        <span>Trên toàn quốc</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className=" rounded-full p-4 bg-[color:var(--accent)]">
                                        <HiMiniUserGroup
                                            size={30}
                                            color="#ffffff"
                                        />
                                    </div>
                                    <div className="flex flex-col font-normal">
                                        <span>Hơn 50 nhân viên</span>
                                        <span>Để phục vụ quý khách</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className=" rounded-full p-4 bg-[color:var(--accent)]">
                                        <FaClock size={30} color="#ffffff" />
                                    </div>
                                    <div className="flex flex-col font-normal">
                                        <span>Mở cửa 8-22h</span>
                                        <span>cả CN & Lễ tết</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                         {/*  */}
                         <div className="flex flex-col gap-6">
                             <FilterLocation
                                 selectedDistrict={selectedDistrict}
                                 selectedProvince={selectedProvince}
                                 setSelectedProvince={(e) => setSelectedProvince(e.target.value)}
                                 setSelectedDistrict={(e) =>
                                     setSelectedDistrict(e.target.value)
                                 }
                                 districts={districts}
                                 locationsCount={locations.length}
                             />
                             <LocationDiamondGrid locations={locations} />
                         </div>
                     </div>
                 </div>
            </MotionDiv>
        </Layout>
    );
};

export default MarketSystemPage;
