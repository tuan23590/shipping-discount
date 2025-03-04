import {
  ActionList,
  BlockStack,
  Card,
  Checkbox,
  DatePicker,
  Icon,
  InlineGrid,
  Popover,
  Text,
  TextField,
} from "@shopify/polaris";
import { CalendarIcon, ClockIcon } from "@shopify/polaris-icons";
import { produce } from "immer";
import React, { useState } from "react";
import { DateTime } from "luxon"; // Thêm Luxon

export default function ActiveDates({
  basicCodeDiscount,
  setBasicCodeDiscount,
}) {
  // Khởi tạo trạng thái ngày và giờ ở EST từ basicCodeDiscount
  const initialStart = DateTime.fromISO(basicCodeDiscount.startsAt, { zone: "utc" }).setZone("America/New_York");
  const initialEnd = basicCodeDiscount.endsAt
    ? DateTime.fromISO(basicCodeDiscount.endsAt, { zone: "utc" }).setZone("America/New_York")
    : null;

  const [visibleStart, setVisibleStart] = useState(false);
  const [visibleEnd, setVisibleEnd] = useState(false);
  const [showStartTimes, setShowStartTimes] = useState(false);
  const [showEndTimes, setShowEndTimes] = useState(false);
  const [endDiscountCheck, setEndDiscountCheck] = useState(basicCodeDiscount.endsAt !== undefined);

  // Trạng thái ngày và giờ ở EST
  const [startEstDate, setStartEstDate] = useState(initialStart.toFormat("yyyy-MM-dd"));
  const [startEstTime, setStartEstTime] = useState(initialStart.toFormat("HH:mm"));
  const [endEstDate, setEndEstDate] = useState(
    initialEnd ? initialEnd.toFormat("yyyy-MM-dd") : initialStart.toFormat("yyyy-MM-dd")
  );
  const [endEstTime, setEndEstTime] = useState(
    initialEnd ? initialEnd.toFormat("HH:mm") : "23:59"
  );

  // Trạng thái tháng và năm cho DatePicker
  const [{ month: startMonth, year: startYear }, setStartDate] = useState({
    month: initialStart.month - 1, // DatePicker dùng tháng 0-11
    year: initialStart.year,
  });
  const [{ month: endMonth, year: endYear }, setEndDate] = useState({
    month: initialEnd ? initialEnd.month - 1 : initialStart.month - 1,
    year: initialEnd ? initialEnd.year : initialStart.year,
  });

  const handleStartDateChange = ({ end: newDate }) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Chuyển từ 0-11 sang 1-12
    const day = newDate.getDate();
    const [hour, minute] = startEstTime.split(":").map(Number);

    // Tạo datetime ở EST
    const estDateTime = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: "America/New_York" }
    );
    setStartEstDate(estDateTime.toFormat("yyyy-MM-dd"));

    // Chuyển sang UTC và lưu
    setBasicCodeDiscount(
      produce(basicCodeDiscount, (draft) => {
        draft.startsAt = estDateTime.toUTC().toISO();
      })
    );
    setVisibleStart(false);
  };

  const handleEndDateChange = ({ end: newDate }) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Chuyển từ 0-11 sang 1-12
    const day = newDate.getDate();
    const [hour, minute] = endEstTime.split(":").map(Number);

    // Tạo datetime ở EST
    const estDateTime = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: "America/New_York" }
    );
    setEndEstDate(estDateTime.toFormat("yyyy-MM-dd"));

    // Chuyển sang UTC và lưu
    setBasicCodeDiscount(
      produce(basicCodeDiscount, (draft) => {
        draft.endsAt = estDateTime.toUTC().toISO();
      })
    );
    setVisibleEnd(false);
  };

  const handleTimeChange = (newTime, isStart) => {
    const [hour12, minute, period] = newTime.split(/[: ]/).map((val, index) => (index === 2 ? val : parseInt(val, 10)));
    const hour = period === "PM" && hour12 !== 12 ? hour12 + 12 : period === "AM" && hour12 === 12 ? 0 : hour12;
    const targetDate = isStart ? startEstDate : endEstDate;

    // Tạo datetime ở EST
    const estDateTime = DateTime.fromFormat(
      `${targetDate} ${hour}:${minute}`,
      "yyyy-MM-dd H:mm",
      { zone: "America/New_York" }
    );

    if (isStart) {
      setStartEstTime(estDateTime.toFormat("HH:mm"));
      setBasicCodeDiscount(
        produce(basicCodeDiscount, (draft) => {
          draft.startsAt = estDateTime.toUTC().toISO();
        })
      );
      setShowStartTimes(false);
    } else {
      setEndEstTime(estDateTime.toFormat("HH:mm"));
      setBasicCodeDiscount(
        produce(basicCodeDiscount, (draft) => {
          draft.endsAt = estDateTime.toUTC().toISO();
        })
      );
      setShowEndTimes(false);
    }
  };

  function toggleEndDiscountCheck() {
    setEndDiscountCheck((checked) => {
      if (!checked) {
        // Khi bật, đặt mặc định là ngày hiện tại ở EST
        const nowEst = DateTime.now().setZone("America/New_York");
        setEndEstDate(nowEst.toFormat("yyyy-MM-dd"));
        setEndEstTime(nowEst.toFormat("HH:mm"));
        setBasicCodeDiscount(
          produce(basicCodeDiscount, (draft) => {
            draft.endsAt = nowEst.toUTC().toISO();
          })
        );
      } else {
        setBasicCodeDiscount(
          produce(basicCodeDiscount, (draft) => {
            delete draft.endsAt;
          })
        );
      }
      return !checked;
    });
  }

  const getListTime = (isStart) => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? "AM" : "PM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const formattedTime = `${hour12.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
        times.push({
          content: formattedTime,
          onAction: () => handleTimeChange(formattedTime, isStart),
        });
      }
    }
    return times;
  };

  // Chuyển giờ 24h sang 12h với AM/PM để hiển thị
  const formatTimeForDisplay = (time24h) => {
    const [hour, minute] = time24h.split(":").map(Number);
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Active dates
          </Text>
        </InlineGrid>
        <BlockStack gap="300">
          <InlineGrid columns={2} gap="300">
            {/* Start Date and Time */}
            <Popover
              active={visibleStart}
              autofocusTarget="none"
              preferredAlignment="left"
              fullWidth
              preferInputActivator={false}
              onClose={() => setVisibleStart(false)}
              activator={
                <TextField
                  label="Start date"
                  prefix={<Icon source={CalendarIcon} />}
                  value={startEstDate} // Hiển thị ngày ở EST
                  onFocus={() => setVisibleStart(true)}
                  autoComplete="off"
                />
              }
            >
              <Card>
                <DatePicker
                  month={startMonth}
                  year={startYear}
                  selected={DateTime.fromFormat(startEstDate, "yyyy-MM-dd", { zone: "America/New_York" }).toJSDate()}
                  onMonthChange={(month, year) => setStartDate({ month, year })}
                  onChange={handleStartDateChange}
                />
              </Card>
            </Popover>
            <Popover
              active={showStartTimes}
              activator={
                <TextField
                  label="Start time"
                  value={formatTimeForDisplay(startEstTime)} // Hiển thị giờ ở EST
                  onFocus={() => setShowStartTimes(true)}
                  autoComplete="off"
                  prefix={<Icon source={ClockIcon} />}
                />
              }
              onClose={() => setShowStartTimes(false)}
            >
              <ActionList items={getListTime(true)} />
            </Popover>
          </InlineGrid>
          <InlineGrid>
            <Checkbox
              label="Set end date"
              checked={endDiscountCheck}
              onChange={toggleEndDiscountCheck}
            />
          </InlineGrid>
          {/* End Date and Time */}
          {endDiscountCheck && (
            <InlineGrid columns={2} gap="300">
              <Popover
                active={visibleEnd}
                autofocusTarget="none"
                preferredAlignment="left"
                fullWidth
                preferInputActivator={false}
                onClose={() => setVisibleEnd(false)}
                activator={
                  <TextField
                    label="End date"
                    prefix={<Icon source={CalendarIcon} />}
                    value={endEstDate} // Hiển thị ngày ở EST
                    onFocus={() => setVisibleEnd(true)}
                    autoComplete="off"
                  />
                }
              >
                <Card>
                  <DatePicker
                    month={endMonth}
                    year={endYear}
                    selected={DateTime.fromFormat(endEstDate, "yyyy-MM-dd", { zone: "America/New_York" }).toJSDate()}
                    onMonthChange={(month, year) => setEndDate({ month, year })}
                    onChange={handleEndDateChange}
                  />
                </Card>
              </Popover>
              <Popover
                active={showEndTimes}
                activator={
                  <TextField
                    label="End time"
                    value={formatTimeForDisplay(endEstTime)} // Hiển thị giờ ở EST
                    onFocus={() => setShowEndTimes(true)}
                    autoComplete="off"
                    prefix={<Icon source={ClockIcon} />}
                  />
                }
                onClose={() => setShowEndTimes(false)}
              >
                <ActionList items={getListTime(false)} />
              </Popover>
            </InlineGrid>
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}