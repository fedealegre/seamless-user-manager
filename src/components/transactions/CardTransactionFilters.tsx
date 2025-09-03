import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { DatePicker } from "@/components/ui/date-picker";
import { Card as CardType } from "@/lib/api-types";
import { CardFiltersType } from "@/hooks/use-user-cards-transactions";

interface CardTransactionFiltersProps {
  filters: CardFiltersType;
  cards: CardType[];
  onApply: (filters: CardFiltersType) => void;
  onReset: () => void;
}

const CardTransactionFilters: React.FC<CardTransactionFiltersProps> = ({
  filters,
  cards,
  onApply,
  onReset,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [localFilters, setLocalFilters] = useState<CardFiltersType>(filters);
  
  // State for date objects
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  const handleChange = (name: keyof CardFiltersType, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardSelection = (cardId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      cardIds: checked 
        ? [...prev.cardIds, cardId]
        : prev.cardIds.filter(id => id !== cardId)
    }));
  };

  const handleSelectAllCards = () => {
    const allCardIds = cards.map(c => c.id.toString());
    setLocalFilters(prev => ({
      ...prev,
      cardIds: prev.cardIds.length === cards.length ? [] : allCardIds
    }));
  };
  
  // Handler for start date changes
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateObj(date);
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setLocalFilters(prev => ({
        ...prev,
        startDate: startOfDay.toISOString()
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        startDate: ''
      }));
    }
  };
  
  // Handler for end date changes
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDateObj(date);
    if (date) {
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setLocalFilters(prev => ({
        ...prev,
        endDate: endOfDay.toISOString()
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    setStartDateObj(undefined);
    setEndDateObj(undefined);
    setLocalFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      transactionId: "",
      cardIds: [],
    });
    onReset();
  };

  const getSelectedCardsText = () => {
    if (localFilters.cardIds.length === 0 || localFilters.cardIds.length === cards.length) {
      return t("all-cards");
    }
    if (localFilters.cardIds.length === 1) {
      const card = cards.find(c => c.id.toString() === localFilters.cardIds[0]);
      return card?.maskedCardNumber || "";
    }
    return `${localFilters.cardIds.length} ${t("cards").toLowerCase()}`;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{t("transaction-filters")}</h3>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X size={16} className="mr-2" />
            {t("clear-all")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card Selection */}
          <div className="space-y-2">
            <Label>{t("cards")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {getSelectedCardsText()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      id="select-all"
                      checked={localFilters.cardIds.length === cards.length}
                      onCheckedChange={handleSelectAllCards}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      {t("all-cards")}
                    </label>
                  </div>
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`card-${card.id}`}
                        checked={localFilters.cardIds.includes(card.id.toString())}
                        onCheckedChange={(checked) => handleCardSelection(card.id.toString(), !!checked)}
                      />
                      <label htmlFor={`card-${card.id}`} className="text-sm">
                        {card.maskedCardNumber}
                        {card.isDefault && " (Default)"}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("select-status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t("all-statuses")}</SelectItem>
                  <SelectItem value="CONFIRMED">{t("confirmed")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                  <SelectItem value="failed">{t("failed")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type">{t("transaction-type")}</Label>
            <Select
              value={localFilters.transactionType}
              onValueChange={(value) => handleChange("transactionType", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder={t("select-type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t("all-types")}</SelectItem>
                  <SelectItem value="TRANSFER_P2P">{t("transfer_p2p")}</SelectItem>
                  <SelectItem value="QR_PAYMENT">{t("qr_payment")}</SelectItem>
                  <SelectItem value="CASH_IN">{t("cash_in")}</SelectItem>
                  <SelectItem value="CASH_OUT">{t("cash_out")}</SelectItem>
                  <SelectItem value="TRANSFER_CASH_IN">{t("transfer_cash_in")}</SelectItem>
                  <SelectItem value="TRANSFER_CASH_OUT">{t("transfer_cash_out")}</SelectItem>
                  <SelectItem value="TK_PAY_REQ">{t("tk_pay_req")}</SelectItem>
                  <SelectItem value="TK_PAY_REQ_CASH_OUT">{t("tk_pay_req_cash_out")}</SelectItem>
                  <SelectItem value="COMPENSATE">{t("compensate")}</SelectItem>
                  <SelectItem value="deposit">{t("deposit")}</SelectItem>
                  <SelectItem value="withdrawal">{t("withdrawal")}</SelectItem>
                  <SelectItem value="transfer">{t("transfer")}</SelectItem>
                  <SelectItem value="compensation">{t("compensation")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">{t("start-date")}</Label>
            <DatePicker 
              id="startDate"
              date={startDateObj}
              onSelect={handleStartDateChange}
              displayTime={false}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">{t("end-date")}</Label>
            <DatePicker 
              id="endDate"
              date={endDateObj}
              onSelect={handleEndDateChange}
              displayTime={false}
            />
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label htmlFor="transactionId">{t("transaction-id")}</Label>
            <input
              id="transactionId"
              type="text"
              value={localFilters.transactionId || ""}
              onChange={(e) => handleChange("transactionId", e.target.value)}
              placeholder={t("search-transaction-id")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleApply} className="ml-2">
            {t("apply-filters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTransactionFilters;