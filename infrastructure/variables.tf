variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "EC2 instance AMI ID"
  type        = string
  default     = ""
}

variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "echoes"
}

variable "db_username" {
  description = "RDS database username"
  type        = string
  default     = ""
}

variable "db_password" {
  description = "RDS database password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "s3_bucket_name" {
  description = "S3 bucket name for storing avatars"
  type        = string
  default     = "avatars"
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "admin_cidr_block" {
  description = "CIDR block for admin access"
  type        = string
}
