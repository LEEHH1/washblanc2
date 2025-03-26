"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

interface InquiryForm {
  franchiseTypes: {
    detailingShop: boolean;
    selfCarWash: boolean;
    noBrush: boolean;
  };
  name: string;
  phone: string;
  desiredLocation: string;
  referralSource: string;
  estimatedInvestment: string;
  hasCarWashExperience: boolean;
  hasLandOwnership: boolean;
}

export default function InquiryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InquiryForm>({
    defaultValues: {
      franchiseTypes: {
        detailingShop: false,
        selfCarWash: false,
        noBrush: false,
      },
      hasCarWashExperience: false,
      hasLandOwnership: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 체크박스 확인
  const franchiseTypes = watch("franchiseTypes");
  const anyFranchiseSelected =
    franchiseTypes.detailingShop ||
    franchiseTypes.selfCarWash ||
    franchiseTypes.noBrush;

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "파일이 선택되지 않았습니다.");
    console.log("선택한 파일:", file);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: InquiryForm) => {
    try {
      setIsSubmitting(true);
      setResponseMessage(null);

      const formData = new FormData();

      // 가맹유형 - 체크된 항목만 추가
      if (data.franchiseTypes.detailingShop)
        formData.append("franchiseType[]", "detailingShop");
      if (data.franchiseTypes.selfCarWash)
        formData.append("franchiseType[]", "selfCarWash");
      if (data.franchiseTypes.noBrush)
        formData.append("franchiseType[]", "noBrush");

      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("desiredLocation", data.desiredLocation);
      formData.append("referralSource", data.referralSource);
      formData.append("estimatedInvestment", data.estimatedInvestment);
      formData.append(
        "hasCarWashExperience",
        String(data.hasCarWashExperience)
      );
      formData.append("hasLandOwnership", String(data.hasLandOwnership));

      // 파일 추가
      if (fileInputRef.current?.files?.[0]) {
        formData.append("document", fileInputRef.current.files[0]);
      }

      // FormData 내용 확인
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await fetch("http://localhost:4000/inquiry", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setResponseMessage("문의가 성공적으로 접수되었습니다! 🚀");
      } else {
        throw new Error("문의 접수에 실패했습니다.");
      }
    } catch (error) {
      setResponseMessage("오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">가맹점 문의</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 가맹유형 (체크박스) */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              가맹유형 (중복선택 가능)
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="detailingShop"
                  {...register("franchiseTypes.detailingShop")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="detailingShop" className="ml-2 text-gray-700">
                  디테일링샵
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selfCarWash"
                  {...register("franchiseTypes.selfCarWash")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="selfCarWash" className="ml-2 text-gray-700">
                  셀프세차장
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noBrush"
                  {...register("franchiseTypes.noBrush")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="noBrush" className="ml-2 text-gray-700">
                  노브러쉬
                </label>
              </div>
            </div>
            {!anyFranchiseSelected && (
              <p className="text-red-500 text-sm mt-1">
                가맹유형을 하나 이상 선택해주세요
              </p>
            )}
          </div>

          {/* 성함 입력 */}
          <div>
            <label className="block font-medium text-gray-700">성함</label>
            <input
              {...register("name", { required: "성함을 입력해주세요" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 연락처 입력 */}
          <div>
            <label className="block font-medium text-gray-700">연락처</label>
            <input
              {...register("phone", { required: "연락처를 입력해주세요" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* 희망지역 */}
          <div>
            <label className="block font-medium text-gray-700">희망지역</label>
            <select
              {...register("desiredLocation", {
                required: "희망지역을 선택해주세요",
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">희망지역 선택</option>
              <option value="서울">서울</option>
              <option value="인천">인천</option>
              <option value="경기">경기</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
            {errors.desiredLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.desiredLocation.message}
              </p>
            )}
          </div>

          {/* 유입경로 */}
          <div>
            <label className="block font-medium text-gray-700">유입경로</label>
            <select
              {...register("referralSource", {
                required: "유입경로를 선택해주세요",
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">유입경로 선택</option>
              <option value="지인추천">지인추천</option>
              <option value="유튜브">유튜브</option>
              <option value="블로그">블로그</option>
              <option value="인스타그램">인스타그램</option>
              <option value="매장이용고객">매장이용고객</option>
              <option value="기타">기타</option>
            </select>
            {errors.referralSource && (
              <p className="text-red-500 text-sm mt-1">
                {errors.referralSource.message}
              </p>
            )}
          </div>

          {/* 예상투자금 */}
          <div>
            <label className="block font-medium text-gray-700">
              예상투자금
            </label>
            <select
              {...register("estimatedInvestment", {
                required: "예상투자금을 선택해주세요",
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">예상투자금 선택</option>
              <option value="1억 미만">1억 미만</option>
              <option value="1억~5억">1억~5억</option>
              <option value="5억~10억">5억~10억</option>
              <option value="미정">미정</option>
            </select>
            {errors.estimatedInvestment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedInvestment.message}
              </p>
            )}
          </div>

          {/* 세차장운영경험 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              세차장운영경험
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="experience-yes"
                  value="true"
                  {...register("hasCarWashExperience")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="experience-yes" className="ml-2 text-gray-700">
                  있음
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="experience-no"
                  value="false"
                  {...register("hasCarWashExperience")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="experience-no" className="ml-2 text-gray-700">
                  없음
                </label>
              </div>
            </div>
          </div>

          {/* 토지소유여부 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              토지소유여부
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="land-yes"
                  value="true"
                  {...register("hasLandOwnership")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="land-yes" className="ml-2 text-gray-700">
                  있음
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="land-no"
                  value="false"
                  {...register("hasLandOwnership")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="land-no" className="ml-2 text-gray-700">
                  없음
                </label>
              </div>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div>
            <label className="block font-medium text-gray-700">
              기획서 첨부
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer block bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg mt-1 hover:bg-gray-300"
            >
              {fileName || "파일 선택하기"}
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || !anyFranchiseSelected}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
            ) : (
              "제출하기"
            )}
          </button>
        </form>

        {/* 응답 메시지 */}
        {responseMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 text-center rounded-lg">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}
