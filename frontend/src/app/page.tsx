"use client";

import type React from "react";

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
  startupSchedule: string; // 창업예정일정
  assetDetails: string; // 자본 및 부동산 보유내용 (선택)
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
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: InquiryForm) => {
    try {
      setIsSubmitting(true);
      setResponseMessage(null);

      const formData = new FormData();

      // 프랜차이즈 유형을 배열로 변환
      const franchiseTypes = [];
      if (data.franchiseTypes.detailingShop)
        franchiseTypes.push("detailingShop");
      if (data.franchiseTypes.selfCarWash) franchiseTypes.push("selfCarWash");
      if (data.franchiseTypes.noBrush) franchiseTypes.push("noBrush");

      // 배열의 각 항목을 동일한 이름으로 추가 (백엔드에서 배열로 인식)
      franchiseTypes.forEach((type) => {
        formData.append("franchiseTypes", type);
      });

      // 선택된 가맹유형을 텍스트로도 추가 (이메일용)
      const selectedTypesText = [];
      if (data.franchiseTypes.detailingShop)
        selectedTypesText.push("디테일링샵");
      if (data.franchiseTypes.selfCarWash) selectedTypesText.push("셀프세차장");
      if (data.franchiseTypes.noBrush) selectedTypesText.push("노브러쉬");
      formData.append("franchiseTypesText", selectedTypesText.join(", "));

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

      // 새로 추가된 필드들
      formData.append("startupSchedule", data.startupSchedule);
      formData.append("assetDetails", data.assetDetails || ""); // 선택 필드이므로 빈 문자열 기본값

      // 파일 추가
      if (fileInputRef.current?.files?.[0]) {
        formData.append("document", fileInputRef.current.files[0]);
      }

      // 백엔드 URL
      const apiUrl = "https://backend-production-5534.up.railway.app/inquiry";

      const response = await fetch(apiUrl, {
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
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#5ECECE",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        color: "#FFFFFF",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Wash Blanc
          </h1>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            가맹 문의하기
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 가맹유형 (체크박스) */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              가맹유형 (중복선택 가능)
            </label>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  id="detailingShop"
                  {...register("franchiseTypes.detailingShop")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="detailingShop"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  디테일링샵
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  id="selfCarWash"
                  {...register("franchiseTypes.selfCarWash")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="selfCarWash"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  셀프세차장
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  id="noBrush"
                  {...register("franchiseTypes.noBrush")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="noBrush"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  노브러쉬
                </label>
              </div>
            </div>

            {!anyFranchiseSelected && (
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                가맹유형을 하나 이상 선택해주세요
              </p>
            )}
          </div>

          {/* 성함 입력 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              성함
            </label>
            <input
              {...register("name", { required: "성함을 입력해주세요" })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
              }}
              placeholder="성함을 입력해주세요"
            />
            {errors.name && (
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* 연락처 입력 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              연락처
            </label>
            <input
              {...register("phone", { required: "연락처를 입력해주세요" })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
              }}
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* 희망지역 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              희망지역
            </label>
            <select
              {...register("desiredLocation", {
                required: "희망지역을 선택해주세요",
              })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="%235ECECE" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
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
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.desiredLocation.message}
              </p>
            )}
          </div>

          {/* 유입경로 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              유입경로
            </label>
            <select
              {...register("referralSource", {
                required: "유입경로를 선택해주세요",
              })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="%235ECECE" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
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
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.referralSource.message}
              </p>
            )}
          </div>

          {/* 예상투자금 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              예상투자금
            </label>
            <select
              {...register("estimatedInvestment", {
                required: "예상투자금을 선택해주세요",
              })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="%235ECECE" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="">예상투자금 선택</option>
              <option value="1억 미만">1억 미만</option>
              <option value="1억~5억">1억~5억</option>
              <option value="5억~10억">5억~10억</option>
              <option value="미정">미정</option>
            </select>
            {errors.estimatedInvestment && (
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.estimatedInvestment.message}
              </p>
            )}
          </div>
          {/* 창업예정일정 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              창업예정일정
            </label>
            <input
              {...register("startupSchedule", {
                required: "창업예정일정을 입력해주세요",
              })}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
              }}
              placeholder="예: 2025년 상반기, 3개월 이내 등"
            />
            {errors.startupSchedule && (
              <p
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {errors.startupSchedule.message}
              </p>
            )}
          </div>

          {/* 자본 및 부동산 보유내용 (선택) */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              자본 및 부동산 보유내용 (선택)
            </label>
            <textarea
              {...register("assetDetails")}
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333333",
                boxSizing: "border-box",
                minHeight: "100px",
                resize: "vertical",
              }}
              placeholder="보유하신 자본이나 부동산에 대한 상세 내용을 적어주세요 (선택사항)"
            />
          </div>
          {/* 세차장운영경험 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              세차장운영경험
            </label>
            <div
              style={{
                display: "flex",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "30px",
                }}
              >
                <input
                  type="radio"
                  id="experience-yes"
                  value="true"
                  {...register("hasCarWashExperience")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="experience-yes"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  있음
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  id="experience-no"
                  value="false"
                  {...register("hasCarWashExperience")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="experience-no"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  없음
                </label>
              </div>
            </div>
          </div>

          {/* 토지소유여부 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              토지소유여부
            </label>
            <div
              style={{
                display: "flex",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "30px",
                }}
              >
                <input
                  type="radio"
                  id="land-yes"
                  value="true"
                  {...register("hasLandOwnership")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="land-yes"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  있음
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  id="land-no"
                  value="false"
                  {...register("hasLandOwnership")}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    accentColor: "#5ECECE",
                  }}
                />
                <label
                  htmlFor="land-no"
                  style={{ fontSize: "16px", color: "#333333" }}
                >
                  없음
                </label>
              </div>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              기획서 첨부
            </label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              style={{
                display: "block",
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#FFFFFF",
                border: "2px dashed #5ECECE",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#5ECECE",
                textAlign: "center",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              {fileName || "파일 선택하기"}
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || !anyFranchiseSelected}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#FFFFFF",
              color: "#5ECECE",
              border: "none",
              borderRadius: "30px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor:
                isSubmitting || !anyFranchiseSelected
                  ? "not-allowed"
                  : "pointer",
              opacity: isSubmitting || !anyFranchiseSelected ? 0.7 : 1,
              transition: "all 0.3s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {isSubmitting ? (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "3px solid #5ECECE",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            ) : (
              "가맹 문의하기"
            )}
          </button>
        </form>

        {/* 응답 메시지 */}
        {responseMessage && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#FFFFFF",
              color: "#5ECECE",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            {responseMessage}
          </div>
        )}

        {/* 애니메이션을 위한 스타일 */}
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
