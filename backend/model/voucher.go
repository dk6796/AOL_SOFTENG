package model

type Voucher struct {
	VoucherID 	uint 	`gorm:"primaryKey"`
	VoucherName 	string
	VoucherCost	uint
	VoucherDesc	string
	VoucherImage	string
	VoucherStock	uint
}