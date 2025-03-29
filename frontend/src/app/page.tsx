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

      // 가맹유형 - 배열이 아닌 개별 필드로 전송
      formData.append(
        "detailingShop",
        String(data.franchiseTypes.detailingShop)
      );
      formData.append("selfCarWash", String(data.franchiseTypes.selfCarWash));
      formData.append("noBrush", String(data.franchiseTypes.noBrush));

      // 선택된 가맹유형을 텍스트로도 추가
      const selectedTypes = [];
      if (data.franchiseTypes.detailingShop) selectedTypes.push("디테일링샵");
      if (data.franchiseTypes.selfCarWash) selectedTypes.push("셀프세차장");
      if (data.franchiseTypes.noBrush) selectedTypes.push("노브러쉬");
      formData.append("franchiseTypesText", selectedTypes.join(", "));

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

      // API URL 결정 (환경에 따라 다른 URL 사용)
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const apiUrl = `${apiBaseUrl}/inquiry`;

      // FormData 내용 확인
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

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

  // 인라인 스타일 정의
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "2rem",
      width: "100%",
      maxWidth: "32rem",
    },
    title: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
    },
    select: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      outline: "none",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    checkbox: {
      height: "1rem",
      width: "1rem",
      marginRight: "0.5rem",
    },
    radioContainer: {
      display: "flex",
      gap: "1rem",
    },
    radioGroup: {
      display: "flex",
      alignItems: "center",
    },
    radio: {
      height: "1rem",
      width: "1rem",
      marginRight: "0.5rem",
    },
    fileButton: {
      display: "block",
      width: "100%",
      backgroundColor: "#e5e7eb",
      color: "#374151",
      textAlign: "center",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      cursor: "pointer",
    },
    submitButton: {
      width: "100%",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    submitButtonDisabled: {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    successMessage: {
      marginTop: "1rem",
      padding: "0.75rem",
      backgroundColor: "#d1fae5",
      color: "#047857",
      textAlign: "center",
      borderRadius: "0.5rem",
    },
    spinner: {
      height: "1.25rem",
      width: "1.25rem",
      borderTop: "2px solid white",
      borderRight: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>가맹점 문의</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 가맹유형 (체크박스) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>가맹유형 (중복선택 가능)</label>
            <div>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="detailingShop"
                  {...register("franchiseTypes.detailingShop")}
                  style={styles.checkbox}
                />
                <label htmlFor="detailingShop">디테일링샵</label>
              </div>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="selfCarWash"
                  {...register("franchiseTypes.selfCarWash")}
                  style={styles.checkbox}
                />
                <label htmlFor="selfCarWash">셀프세차장</label>
              </div>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="noBrush"
                  {...register("franchiseTypes.noBrush")}
                  style={styles.checkbox}
                />
                <label htmlFor="noBrush">노브러쉬</label>
              </div>
            </div>
            {!anyFranchiseSelected && (
              <p style={styles.errorMessage}>
                가맹유형을 하나 이상 선택해주세요
              </p>
            )}
          </div>

          {/* 성함 입력 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>성함</label>
            <input
              {...register("name", { required: "성함을 입력해주세요" })}
              style={styles.input}
            />
            {errors.name && (
              <p style={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>

          {/* 연락처 입력 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>연락처</label>
            <input
              {...register("phone", { required: "연락처를 입력해주세요" })}
              style={styles.input}
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p style={styles.errorMessage}>{errors.phone.message}</p>
            )}
          </div>

          {/* 희망지역 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>희망지역</label>
            <select
              {...register("desiredLocation", {
                required: "희망지역을 선택해주세요",
              })}
              style={styles.select}
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
              <p style={styles.errorMessage}>
                {errors.desiredLocation.message}
              </p>
            )}
          </div>

          {/* 유입경로 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>유입경로</label>
            <select
              {...register("referralSource", {
                required: "유입경로를 선택해주세요",
              })}
              style={styles.select}
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
              <p style={styles.errorMessage}>{errors.referralSource.message}</p>
            )}
          </div>

          {/* 예상투자금 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>예상투자금</label>
            <select
              {...register("estimatedInvestment", {
                required: "예상투자금을 선택해주세요",
              })}
              style={styles.select}
            >
              <option value="">예상투자금 선택</option>
              <option value="1억 미만">1억 미만</option>
              <option value="1억~5억">1억~5억</option>
              <option value="5억~10억">5억~10억</option>
              <option value="미정">미정</option>
            </select>
            {errors.estimatedInvestment && (
              <p style={styles.errorMessage}>
                {errors.estimatedInvestment.message}
              </p>
            )}
          </div>

          {/* 세차장운영경험 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>세차장운영경험</label>
            <div style={styles.radioContainer}>
              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="experience-yes"
                  value="true"
                  {...register("hasCarWashExperience")}
                  style={styles.radio}
                />
                <label htmlFor="experience-yes">있음</label>
              </div>
              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="experience-no"
                  value="false"
                  {...register("hasCarWashExperience")}
                  style={styles.radio}
                />
                <label htmlFor="experience-no">없음</label>
              </div>
            </div>
          </div>

          {/* 토지소유여부 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>토지소유여부</label>
            <div style={styles.radioContainer}>
              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="land-yes"
                  value="true"
                  {...register("hasLandOwnership")}
                  style={styles.radio}
                />
                <label htmlFor="land-yes">있음</label>
              </div>
              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="land-no"
                  value="false"
                  {...register("hasLandOwnership")}
                  style={styles.radio}
                />
                <label htmlFor="land-no">없음</label>
              </div>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>기획서 첨부</label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" style={styles.fileButton}>
              {fileName || "파일 선택하기"}
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || !anyFranchiseSelected}
            style={{
              ...styles.submitButton,
              ...(isSubmitting || !anyFranchiseSelected
                ? styles.submitButtonDisabled
                : {}),
            }}
          >
            {isSubmitting ? (
              <div
                style={{
                  ...styles.spinner,
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            ) : (
              "제출하기"
            )}
          </button>
        </form>

        {/* 응답 메시지 */}
        {responseMessage && (
          <div style={styles.successMessage}>{responseMessage}</div>
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
