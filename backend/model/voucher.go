package model

import "time"

type Voucher struct {
	VoucherID 	uint 	`gorm:"primaryKey"`
	VoucherName 	string
	VoucherCost	uint
	VoucherDesc	string
	VoucherType  	string
	VoucherImage	string
	VoucherStock	uint
}

type ExchangeVoucher struct {
	ExchangeID	uint		`gorm:"primaryKey"`
	UserID		uint
	User			User		`gorm:"foreignKey:UserID"`
	VoucherID		uint
	Voucher		Voucher	`gorm:"foreignKey:VoucherID"`
	ExchangeTime	time.Time
}