import PDFViewer from "@/components/dashboard/PDFViewer";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const mindeeResponse = {
  apiRequest: {
    error: {},
    resources: ["document"],
    status: "success",
    statusCode: 201,
    url: "https://api.mindee.net/v1/products/mindee/invoices/v4/predict",
  },
  rawHttp: {
    api_request: {
      error: {},
      resources: ["document"],
      status: "success",
      status_code: 201,
      url: "https://api.mindee.net/v1/products/mindee/invoices/v4/predict",
    },
    document: {
      id: "23f2d55e-7bc3-4b58-87f9-be323d4f5616",
      inference: {
        extras: {},
        finished_at: "2024-05-12T13:15:48.247180",
        is_rotation_applied: true,
        pages: [
          {
            extras: {},
            id: 0,
            orientation: {
              value: 0,
            },
            prediction: {
              billing_address: {
                confidence: 1,
                polygon: [
                  [0.133, 0.161],
                  [0.281, 0.161],
                  [0.281, 0.186],
                  [0.133, 0.186],
                ],
                value: "P.O BOX 4115 CANTON, GA 30114",
              },
              customer_address: {
                confidence: 1,
                polygon: [
                  [0.584, 0.146],
                  [0.738, 0.146],
                  [0.738, 0.17],
                  [0.584, 0.17],
                ],
                value: "34 CEDAR GATE LN KINGSTON GA 30145",
              },
              customer_company_registrations: [],
              customer_id: {
                confidence: 0,
                polygon: [],
                value: null,
              },
              customer_name: {
                confidence: 1,
                polygon: [
                  [0.133, 0.146],
                  [0.277, 0.146],
                  [0.277, 0.155],
                  [0.133, 0.155],
                ],
                raw_value: "PRECISION HOMES",
                value: "PRECISION HOMES",
              },
              date: {
                confidence: 0.99,
                polygon: [
                  [0.204, 0.251],
                  [0.279, 0.251],
                  [0.279, 0.264],
                  [0.204, 0.264],
                ],
                value: "2024-03-18",
              },
              document_type: {
                value: "INVOICE",
              },
              due_date: {
                confidence: 0.99,
                polygon: [
                  [0.516, 0.251],
                  [0.592, 0.251],
                  [0.592, 0.264],
                  [0.516, 0.264],
                ],
                value: "2024-04-02",
              },
              invoice_number: {
                confidence: 1,
                polygon: [
                  [0.037, 0.252],
                  [0.068, 0.252],
                  [0.068, 0.261],
                  [0.037, 0.261],
                ],
                value: "3728",
              },
              line_items: [
                {
                  confidence: 1,
                  description: "SLAB PUMP SUPPLY FOR SLAB",
                  polygon: [
                    [0.167, 0.343],
                    [0.967, 0.343],
                    [0.967, 0.355],
                    [0.167, 0.355],
                  ],
                  product_code: "PUMP SUPPLY",
                  quantity: 1,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 1800,
                  unit_price: 1800,
                },
                {
                  confidence: 1,
                  description:
                    "BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)",
                  polygon: [
                    [0.167, 0.365],
                    [0.968, 0.365],
                    [0.968, 0.409],
                    [0.167, 0.409],
                  ],
                  product_code: "BASEMENT",
                  quantity: 6.75,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 9112.5,
                  unit_price: 1.35,
                },
                {
                  confidence: 1,
                  description: "FOOTINGS",
                  polygon: [
                    [0.167, 0.416],
                    [0.967, 0.416],
                    [0.967, 0.428],
                    [0.167, 0.428],
                  ],
                  product_code: "FOOTINGS",
                  quantity: 331,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 1986,
                  unit_price: 6,
                },
                {
                  confidence: 1,
                  description: "#4 TIED REBAR LABOR",
                  polygon: [
                    [0.167, 0.438],
                    [0.968, 0.438],
                    [0.968, 0.451],
                    [0.167, 0.451],
                  ],
                  product_code: "TIED REBAR",
                  quantity: 3.2,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 1280,
                  unit_price: 0.4,
                },
                {
                  confidence: 1,
                  description: "SAW CUTTING PER LINEAL FT",
                  polygon: [
                    [0.167, 0.461],
                    [0.968, 0.461],
                    [0.968, 0.473],
                    [0.167, 0.473],
                  ],
                  product_code: "SAW CUTTING",
                  quantity: 774,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 774,
                  unit_price: 1,
                },
                {
                  confidence: 1,
                  description: "BOB CAT TIME",
                  polygon: [
                    [0.167, 0.484],
                    [0.967, 0.484],
                    [0.967, 0.496],
                    [0.167, 0.496],
                  ],
                  product_code: "BOB CAT",
                  quantity: 1,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 650,
                  unit_price: 650,
                },
                {
                  confidence: 1,
                  description: "PORCH SAFE ROOM LABOR & FORM WITH PLYWOOD",
                  polygon: [
                    [0.167, 0.507],
                    [0.967, 0.507],
                    [0.967, 0.533],
                    [0.167, 0.533],
                  ],
                  product_code: "PORCH DECK",
                  quantity: 1,
                  tax_amount: null,
                  tax_rate: null,
                  total_amount: 500,
                  unit_price: 500,
                },
              ],
              locale: {
                confidence: 0.85,
                currency: "USD",
                language: "en",
              },
              orientation: {
                confidence: 0.99,
                degrees: 0,
              },
              reference_numbers: [],
              shipping_address: {
                confidence: 1,
                polygon: [
                  [0.584, 0.146],
                  [0.738, 0.146],
                  [0.738, 0.17],
                  [0.584, 0.17],
                ],
                value: "34 CEDAR GATE LN KINGSTON GA 30145",
              },
              supplier_address: {
                confidence: 1,
                polygon: [
                  [0.142, 0.066],
                  [0.318, 0.066],
                  [0.318, 0.091],
                  [0.142, 0.091],
                ],
                value: "349 CLAUDE SCOTT RD CANTON, GA 30115",
              },
              supplier_company_registrations: [],
              supplier_email: {
                confidence: 0.99,
                polygon: [
                  [0.138, 0.107],
                  [0.325, 0.107],
                  [0.325, 0.122],
                  [0.138, 0.122],
                ],
                value: "orlandocruz99@yahoo.com",
              },
              supplier_name: {
                confidence: 1,
                polygon: [
                  [0.142, 0.051],
                  [0.28, 0.051],
                  [0.28, 0.06],
                  [0.142, 0.06],
                ],
                raw_value: "ROMA CONCRETE",
                value: "ROMA CONCRETE",
              },
              supplier_payment_details: [],
              supplier_phone_number: {
                confidence: 1,
                polygon: [
                  [0.141, 0.095],
                  [0.231, 0.095],
                  [0.231, 0.103],
                  [0.141, 0.103],
                ],
                value: "7706088191",
              },
              supplier_website: {
                confidence: 0,
                polygon: [],
                value: null,
              },
              taxes: [],
              total_amount: {
                confidence: 1,
                polygon: [
                  [0.853, 0.544],
                  [0.969, 0.544],
                  [0.969, 0.561],
                  [0.853, 0.561],
                ],
                value: 16102.5,
              },
              total_net: {
                confidence: 1,
                polygon: [
                  [0.853, 0.544],
                  [0.969, 0.544],
                  [0.969, 0.561],
                  [0.853, 0.561],
                ],
                value: 16102.5,
              },
              total_tax: {
                confidence: 0,
                polygon: [],
                value: null,
              },
            },
          },
        ],
        prediction: {
          billing_address: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.133, 0.161],
              [0.281, 0.161],
              [0.281, 0.186],
              [0.133, 0.186],
            ],
            value: "P.O BOX 4115 CANTON, GA 30114",
          },
          customer_address: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.584, 0.146],
              [0.738, 0.146],
              [0.738, 0.17],
              [0.584, 0.17],
            ],
            value: "34 CEDAR GATE LN KINGSTON GA 30145",
          },
          customer_company_registrations: [],
          customer_id: {
            confidence: 0,
            page_id: null,
            polygon: [],
            value: null,
          },
          customer_name: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.133, 0.146],
              [0.277, 0.146],
              [0.277, 0.155],
              [0.133, 0.155],
            ],
            raw_value: "PRECISION HOMES",
            value: "PRECISION HOMES",
          },
          date: {
            confidence: 0.99,
            page_id: 0,
            polygon: [
              [0.204, 0.251],
              [0.279, 0.251],
              [0.279, 0.264],
              [0.204, 0.264],
            ],
            value: "2024-03-18",
          },
          document_type: {
            value: "INVOICE",
          },
          due_date: {
            confidence: 0.99,
            page_id: 0,
            polygon: [
              [0.516, 0.251],
              [0.592, 0.251],
              [0.592, 0.264],
              [0.516, 0.264],
            ],
            value: "2024-04-02",
          },
          invoice_number: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.037, 0.252],
              [0.068, 0.252],
              [0.068, 0.261],
              [0.037, 0.261],
            ],
            value: "3728",
          },
          line_items: [
            {
              confidence: 1,
              description: "SLAB PUMP SUPPLY FOR SLAB",
              page_id: 0,
              polygon: [
                [0.167, 0.343],
                [0.967, 0.343],
                [0.967, 0.355],
                [0.167, 0.355],
              ],
              product_code: "PUMP SUPPLY",
              quantity: 1,
              tax_amount: null,
              tax_rate: null,
              total_amount: 1800,
              unit_price: 1800,
            },
            {
              confidence: 1,
              description:
                "BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)",
              page_id: 0,
              polygon: [
                [0.167, 0.365],
                [0.968, 0.365],
                [0.968, 0.409],
                [0.167, 0.409],
              ],
              product_code: "BASEMENT",
              quantity: 6.75,
              tax_amount: null,
              tax_rate: null,
              total_amount: 9112.5,
              unit_price: 1.35,
            },
            {
              confidence: 1,
              description: "FOOTINGS",
              page_id: 0,
              polygon: [
                [0.167, 0.416],
                [0.967, 0.416],
                [0.967, 0.428],
                [0.167, 0.428],
              ],
              product_code: "FOOTINGS",
              quantity: 331,
              tax_amount: null,
              tax_rate: null,
              total_amount: 1986,
              unit_price: 6,
            },
            {
              confidence: 1,
              description: "#4 TIED REBAR LABOR",
              page_id: 0,
              polygon: [
                [0.167, 0.438],
                [0.968, 0.438],
                [0.968, 0.451],
                [0.167, 0.451],
              ],
              product_code: "TIED REBAR",
              quantity: 3.2,
              tax_amount: null,
              tax_rate: null,
              total_amount: 1280,
              unit_price: 0.4,
            },
            {
              confidence: 1,
              description: "SAW CUTTING PER LINEAL FT",
              page_id: 0,
              polygon: [
                [0.167, 0.461],
                [0.968, 0.461],
                [0.968, 0.473],
                [0.167, 0.473],
              ],
              product_code: "SAW CUTTING",
              quantity: 774,
              tax_amount: null,
              tax_rate: null,
              total_amount: 774,
              unit_price: 1,
            },
            {
              confidence: 1,
              description: "BOB CAT TIME",
              page_id: 0,
              polygon: [
                [0.167, 0.484],
                [0.967, 0.484],
                [0.967, 0.496],
                [0.167, 0.496],
              ],
              product_code: "BOB CAT",
              quantity: 1,
              tax_amount: null,
              tax_rate: null,
              total_amount: 650,
              unit_price: 650,
            },
            {
              confidence: 1,
              description: "PORCH SAFE ROOM LABOR & FORM WITH PLYWOOD",
              page_id: 0,
              polygon: [
                [0.167, 0.507],
                [0.967, 0.507],
                [0.967, 0.533],
                [0.167, 0.533],
              ],
              product_code: "PORCH DECK",
              quantity: 1,
              tax_amount: null,
              tax_rate: null,
              total_amount: 500,
              unit_price: 500,
            },
          ],
          locale: {
            confidence: 0.85,
            currency: "USD",
            language: "en",
          },
          reference_numbers: [],
          shipping_address: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.584, 0.146],
              [0.738, 0.146],
              [0.738, 0.17],
              [0.584, 0.17],
            ],
            value: "34 CEDAR GATE LN KINGSTON GA 30145",
          },
          supplier_address: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.142, 0.066],
              [0.318, 0.066],
              [0.318, 0.091],
              [0.142, 0.091],
            ],
            value: "349 CLAUDE SCOTT RD CANTON, GA 30115",
          },
          supplier_company_registrations: [],
          supplier_email: {
            confidence: 0.99,
            page_id: 0,
            polygon: [
              [0.138, 0.107],
              [0.325, 0.107],
              [0.325, 0.122],
              [0.138, 0.122],
            ],
            value: "orlandocruz99@yahoo.com",
          },
          supplier_name: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.142, 0.051],
              [0.28, 0.051],
              [0.28, 0.06],
              [0.142, 0.06],
            ],
            raw_value: "ROMA CONCRETE",
            value: "ROMA CONCRETE",
          },
          supplier_payment_details: [],
          supplier_phone_number: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.141, 0.095],
              [0.231, 0.095],
              [0.231, 0.103],
              [0.141, 0.103],
            ],
            value: "7706088191",
          },
          supplier_website: {
            confidence: 0,
            page_id: null,
            polygon: [],
            value: null,
          },
          taxes: [],
          total_amount: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.853, 0.544],
              [0.969, 0.544],
              [0.969, 0.561],
              [0.853, 0.561],
            ],
            value: 16102.5,
          },
          total_net: {
            confidence: 1,
            page_id: 0,
            polygon: [
              [0.853, 0.544],
              [0.969, 0.544],
              [0.969, 0.561],
              [0.853, 0.561],
            ],
            value: 16102.5,
          },
          total_tax: {
            confidence: 0,
            page_id: 0,
            polygon: [],
            value: null,
          },
        },
        processing_time: 1.345,
        product: {
          features: [
            "locale",
            "invoice_number",
            "reference_numbers",
            "date",
            "due_date",
            "total_net",
            "total_amount",
            "total_tax",
            "taxes",
            "supplier_payment_details",
            "supplier_name",
            "supplier_company_registrations",
            "supplier_address",
            "supplier_phone_number",
            "supplier_website",
            "supplier_email",
            "customer_name",
            "customer_company_registrations",
            "customer_address",
            "customer_id",
            "shipping_address",
            "billing_address",
            "document_type",
            "orientation",
            "line_items",
          ],
          name: "mindee/invoices",
          type: "standard",
          version: "4.6",
        },
        started_at: "2024-05-12T13:15:46.902098",
      },
      n_pages: 1,
      name: "Invoice_3728_from_ROMA_CONCRETE.pdf_1715448182966",
    },
  },
  document: {
    id: "23f2d55e-7bc3-4b58-87f9-be323d4f5616",
    filename: "Invoice_3728_from_ROMA_CONCRETE.pdf_1715448182966",
    inference: {
      pages: [
        {
          orientation: {
            value: 0,
            reconstructed: false,
            pageId: 0,
          },
          id: 0,
          prediction: {
            customerCompanyRegistrations: [],
            lineItems: [
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.343],
                  [0.967, 0.343],
                  [0.967, 0.355],
                  [0.167, 0.355],
                ],
                description: "SLAB PUMP SUPPLY FOR SLAB",
                productCode: "PUMP SUPPLY",
                quantity: 1,
                totalAmount: 1800,
                unitPrice: 1800,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.365],
                  [0.968, 0.365],
                  [0.968, 0.409],
                  [0.167, 0.409],
                ],
                description:
                  "BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)",
                productCode: "BASEMENT",
                quantity: 6.75,
                totalAmount: 9112.5,
                unitPrice: 1.35,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.416],
                  [0.967, 0.416],
                  [0.967, 0.428],
                  [0.167, 0.428],
                ],
                description: "FOOTINGS",
                productCode: "FOOTINGS",
                quantity: 331,
                totalAmount: 1986,
                unitPrice: 6,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.438],
                  [0.968, 0.438],
                  [0.968, 0.451],
                  [0.167, 0.451],
                ],
                description: "#4 TIED REBAR LABOR",
                productCode: "TIED REBAR",
                quantity: 3.2,
                totalAmount: 1280,
                unitPrice: 0.4,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.461],
                  [0.968, 0.461],
                  [0.968, 0.473],
                  [0.167, 0.473],
                ],
                description: "SAW CUTTING PER LINEAL FT",
                productCode: "SAW CUTTING",
                quantity: 774,
                totalAmount: 774,
                unitPrice: 1,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.484],
                  [0.967, 0.484],
                  [0.967, 0.496],
                  [0.167, 0.496],
                ],
                description: "BOB CAT TIME",
                productCode: "BOB CAT",
                quantity: 1,
                totalAmount: 650,
                unitPrice: 650,
              },
              {
                confidence: 1,
                polygon: [
                  [0.167, 0.507],
                  [0.967, 0.507],
                  [0.967, 0.533],
                  [0.167, 0.533],
                ],
                description: "PORCH SAFE ROOM LABOR & FORM WITH PLYWOOD",
                productCode: "PORCH DECK",
                quantity: 1,
                totalAmount: 500,
                unitPrice: 500,
              },
            ],
            referenceNumbers: [],
            supplierCompanyRegistrations: [],
            supplierPaymentDetails: [],
            billingAddress: {
              value: "P.O BOX 4115 CANTON, GA 30114",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.133, 0.161],
                [0.281, 0.161],
                [0.281, 0.186],
                [0.133, 0.186],
              ],
              confidence: 1,
              boundingBox: [
                [0.133, 0.161],
                [0.281, 0.161],
                [0.281, 0.186],
                [0.133, 0.186],
              ],
            },
            customerAddress: {
              value: "34 CEDAR GATE LN KINGSTON GA 30145",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.584, 0.146],
                [0.738, 0.146],
                [0.738, 0.17],
                [0.584, 0.17],
              ],
              confidence: 1,
              boundingBox: [
                [0.584, 0.146],
                [0.738, 0.146],
                [0.738, 0.17],
                [0.584, 0.17],
              ],
            },
            customerId: {
              reconstructed: false,
              polygon: [],
              confidence: 0,
              boundingBox: [
                [null, null],
                [null, null],
                [null, null],
                [null, null],
              ],
            },
            customerName: {
              value: "PRECISION HOMES",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.133, 0.146],
                [0.277, 0.146],
                [0.277, 0.155],
                [0.133, 0.155],
              ],
              confidence: 1,
              boundingBox: [
                [0.133, 0.146],
                [0.277, 0.146],
                [0.277, 0.155],
                [0.133, 0.155],
              ],
              rawValue: "PRECISION HOMES",
            },
            date: {
              value: "2024-03-18",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.204, 0.251],
                [0.279, 0.251],
                [0.279, 0.264],
                [0.204, 0.264],
              ],
              confidence: 0.99,
              boundingBox: [
                [0.204, 0.251],
                [0.279, 0.251],
                [0.279, 0.264],
                [0.204, 0.264],
              ],
              dateObject: "2024-03-18T00:00:00.000Z",
            },
            documentType: {
              value: "INVOICE",
              reconstructed: false,
              confidence: 0,
            },
            dueDate: {
              value: "2024-04-02",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.516, 0.251],
                [0.592, 0.251],
                [0.592, 0.264],
                [0.516, 0.264],
              ],
              confidence: 0.99,
              boundingBox: [
                [0.516, 0.251],
                [0.592, 0.251],
                [0.592, 0.264],
                [0.516, 0.264],
              ],
              dateObject: "2024-04-02T00:00:00.000Z",
            },
            invoiceNumber: {
              value: "3728",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.037, 0.252],
                [0.068, 0.252],
                [0.068, 0.261],
                [0.037, 0.261],
              ],
              confidence: 1,
              boundingBox: [
                [0.037, 0.252],
                [0.068, 0.252],
                [0.068, 0.261],
                [0.037, 0.261],
              ],
            },
            locale: {
              value: "en",
              reconstructed: false,
              confidence: 0.85,
              language: "en",
              currency: "USD",
            },
            shippingAddress: {
              value: "34 CEDAR GATE LN KINGSTON GA 30145",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.584, 0.146],
                [0.738, 0.146],
                [0.738, 0.17],
                [0.584, 0.17],
              ],
              confidence: 1,
              boundingBox: [
                [0.584, 0.146],
                [0.738, 0.146],
                [0.738, 0.17],
                [0.584, 0.17],
              ],
            },
            supplierAddress: {
              value: "349 CLAUDE SCOTT RD CANTON, GA 30115",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.142, 0.066],
                [0.318, 0.066],
                [0.318, 0.091],
                [0.142, 0.091],
              ],
              confidence: 1,
              boundingBox: [
                [0.142, 0.066],
                [0.318, 0.066],
                [0.318, 0.091],
                [0.142, 0.091],
              ],
            },
            supplierEmail: {
              value: "orlandocruz99@yahoo.com",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.138, 0.107],
                [0.325, 0.107],
                [0.325, 0.122],
                [0.138, 0.122],
              ],
              confidence: 0.99,
              boundingBox: [
                [0.138, 0.107],
                [0.325, 0.107],
                [0.325, 0.122],
                [0.138, 0.122],
              ],
            },
            supplierName: {
              value: "ROMA CONCRETE",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.142, 0.051],
                [0.28, 0.051],
                [0.28, 0.06],
                [0.142, 0.06],
              ],
              confidence: 1,
              boundingBox: [
                [0.142, 0.051],
                [0.28, 0.051],
                [0.28, 0.06],
                [0.142, 0.06],
              ],
              rawValue: "ROMA CONCRETE",
            },
            supplierPhoneNumber: {
              value: "7706088191",
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.141, 0.095],
                [0.231, 0.095],
                [0.231, 0.103],
                [0.141, 0.103],
              ],
              confidence: 1,
              boundingBox: [
                [0.141, 0.095],
                [0.231, 0.095],
                [0.231, 0.103],
                [0.141, 0.103],
              ],
            },
            supplierWebsite: {
              reconstructed: false,
              polygon: [],
              confidence: 0,
              boundingBox: [
                [null, null],
                [null, null],
                [null, null],
                [null, null],
              ],
            },
            taxes: [],
            totalAmount: {
              value: 16102.5,
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.853, 0.544],
                [0.969, 0.544],
                [0.969, 0.561],
                [0.853, 0.561],
              ],
              confidence: 1,
              boundingBox: [
                [0.853, 0.544],
                [0.969, 0.544],
                [0.969, 0.561],
                [0.853, 0.561],
              ],
            },
            totalNet: {
              value: 16102.5,
              reconstructed: false,
              pageId: 0,
              polygon: [
                [0.853, 0.544],
                [0.969, 0.544],
                [0.969, 0.561],
                [0.853, 0.561],
              ],
              confidence: 1,
              boundingBox: [
                [0.853, 0.544],
                [0.969, 0.544],
                [0.969, 0.561],
                [0.853, 0.561],
              ],
            },
            totalTax: {
              reconstructed: false,
              polygon: [],
              confidence: 0,
              boundingBox: [
                [null, null],
                [null, null],
                [null, null],
                [null, null],
              ],
            },
          },
          extras: {},
        },
      ],
      extras: [],
      isRotationApplied: true,
      product: {
        features: [
          "locale",
          "invoice_number",
          "reference_numbers",
          "date",
          "due_date",
          "total_net",
          "total_amount",
          "total_tax",
          "taxes",
          "supplier_payment_details",
          "supplier_name",
          "supplier_company_registrations",
          "supplier_address",
          "supplier_phone_number",
          "supplier_website",
          "supplier_email",
          "customer_name",
          "customer_company_registrations",
          "customer_address",
          "customer_id",
          "shipping_address",
          "billing_address",
          "document_type",
          "orientation",
          "line_items",
        ],
        name: "mindee/invoices",
        type: "standard",
        version: "4.6",
      },
      endpointName: "invoices",
      endpointVersion: "4",
      prediction: {
        customerCompanyRegistrations: [],
        lineItems: [
          {
            confidence: 1,
            polygon: [
              [0.167, 0.343],
              [0.967, 0.343],
              [0.967, 0.355],
              [0.167, 0.355],
            ],
            description: "SLAB PUMP SUPPLY FOR SLAB",
            productCode: "PUMP SUPPLY",
            quantity: 1,
            totalAmount: 1800,
            unitPrice: 1800,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.365],
              [0.968, 0.365],
              [0.968, 0.409],
              [0.167, 0.409],
            ],
            description:
              "BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)",
            productCode: "BASEMENT",
            quantity: 6.75,
            totalAmount: 9112.5,
            unitPrice: 1.35,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.416],
              [0.967, 0.416],
              [0.967, 0.428],
              [0.167, 0.428],
            ],
            description: "FOOTINGS",
            productCode: "FOOTINGS",
            quantity: 331,
            totalAmount: 1986,
            unitPrice: 6,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.438],
              [0.968, 0.438],
              [0.968, 0.451],
              [0.167, 0.451],
            ],
            description: "#4 TIED REBAR LABOR",
            productCode: "TIED REBAR",
            quantity: 3.2,
            totalAmount: 1280,
            unitPrice: 0.4,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.461],
              [0.968, 0.461],
              [0.968, 0.473],
              [0.167, 0.473],
            ],
            description: "SAW CUTTING PER LINEAL FT",
            productCode: "SAW CUTTING",
            quantity: 774,
            totalAmount: 774,
            unitPrice: 1,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.484],
              [0.967, 0.484],
              [0.967, 0.496],
              [0.167, 0.496],
            ],
            description: "BOB CAT TIME",
            productCode: "BOB CAT",
            quantity: 1,
            totalAmount: 650,
            unitPrice: 650,
            pageId: 0,
          },
          {
            confidence: 1,
            polygon: [
              [0.167, 0.507],
              [0.967, 0.507],
              [0.967, 0.533],
              [0.167, 0.533],
            ],
            description: "PORCH SAFE ROOM LABOR & FORM WITH PLYWOOD",
            productCode: "PORCH DECK",
            quantity: 1,
            totalAmount: 500,
            unitPrice: 500,
            pageId: 0,
          },
        ],
        referenceNumbers: [],
        supplierCompanyRegistrations: [],
        supplierPaymentDetails: [],
        billingAddress: {
          value: "P.O BOX 4115 CANTON, GA 30114",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.133, 0.161],
            [0.281, 0.161],
            [0.281, 0.186],
            [0.133, 0.186],
          ],
          confidence: 1,
          boundingBox: [
            [0.133, 0.161],
            [0.281, 0.161],
            [0.281, 0.186],
            [0.133, 0.186],
          ],
        },
        customerAddress: {
          value: "34 CEDAR GATE LN KINGSTON GA 30145",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.584, 0.146],
            [0.738, 0.146],
            [0.738, 0.17],
            [0.584, 0.17],
          ],
          confidence: 1,
          boundingBox: [
            [0.584, 0.146],
            [0.738, 0.146],
            [0.738, 0.17],
            [0.584, 0.17],
          ],
        },
        customerId: {
          reconstructed: false,
          polygon: [],
          confidence: 0,
          boundingBox: [
            [null, null],
            [null, null],
            [null, null],
            [null, null],
          ],
        },
        customerName: {
          value: "PRECISION HOMES",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.133, 0.146],
            [0.277, 0.146],
            [0.277, 0.155],
            [0.133, 0.155],
          ],
          confidence: 1,
          boundingBox: [
            [0.133, 0.146],
            [0.277, 0.146],
            [0.277, 0.155],
            [0.133, 0.155],
          ],
          rawValue: "PRECISION HOMES",
        },
        date: {
          value: "2024-03-18",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.204, 0.251],
            [0.279, 0.251],
            [0.279, 0.264],
            [0.204, 0.264],
          ],
          confidence: 0.99,
          boundingBox: [
            [0.204, 0.251],
            [0.279, 0.251],
            [0.279, 0.264],
            [0.204, 0.264],
          ],
          dateObject: "2024-03-18T00:00:00.000Z",
        },
        documentType: {
          value: "INVOICE",
          reconstructed: false,
          confidence: 0,
        },
        dueDate: {
          value: "2024-04-02",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.516, 0.251],
            [0.592, 0.251],
            [0.592, 0.264],
            [0.516, 0.264],
          ],
          confidence: 0.99,
          boundingBox: [
            [0.516, 0.251],
            [0.592, 0.251],
            [0.592, 0.264],
            [0.516, 0.264],
          ],
          dateObject: "2024-04-02T00:00:00.000Z",
        },
        invoiceNumber: {
          value: "3728",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.037, 0.252],
            [0.068, 0.252],
            [0.068, 0.261],
            [0.037, 0.261],
          ],
          confidence: 1,
          boundingBox: [
            [0.037, 0.252],
            [0.068, 0.252],
            [0.068, 0.261],
            [0.037, 0.261],
          ],
        },
        locale: {
          value: "en",
          reconstructed: false,
          confidence: 0.85,
          language: "en",
          currency: "USD",
        },
        shippingAddress: {
          value: "34 CEDAR GATE LN KINGSTON GA 30145",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.584, 0.146],
            [0.738, 0.146],
            [0.738, 0.17],
            [0.584, 0.17],
          ],
          confidence: 1,
          boundingBox: [
            [0.584, 0.146],
            [0.738, 0.146],
            [0.738, 0.17],
            [0.584, 0.17],
          ],
        },
        supplierAddress: {
          value: "349 CLAUDE SCOTT RD CANTON, GA 30115",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.142, 0.066],
            [0.318, 0.066],
            [0.318, 0.091],
            [0.142, 0.091],
          ],
          confidence: 1,
          boundingBox: [
            [0.142, 0.066],
            [0.318, 0.066],
            [0.318, 0.091],
            [0.142, 0.091],
          ],
        },
        supplierEmail: {
          value: "orlandocruz99@yahoo.com",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.138, 0.107],
            [0.325, 0.107],
            [0.325, 0.122],
            [0.138, 0.122],
          ],
          confidence: 0.99,
          boundingBox: [
            [0.138, 0.107],
            [0.325, 0.107],
            [0.325, 0.122],
            [0.138, 0.122],
          ],
        },
        supplierName: {
          value: "ROMA CONCRETE",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.142, 0.051],
            [0.28, 0.051],
            [0.28, 0.06],
            [0.142, 0.06],
          ],
          confidence: 1,
          boundingBox: [
            [0.142, 0.051],
            [0.28, 0.051],
            [0.28, 0.06],
            [0.142, 0.06],
          ],
          rawValue: "ROMA CONCRETE",
        },
        supplierPhoneNumber: {
          value: "7706088191",
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.141, 0.095],
            [0.231, 0.095],
            [0.231, 0.103],
            [0.141, 0.103],
          ],
          confidence: 1,
          boundingBox: [
            [0.141, 0.095],
            [0.231, 0.095],
            [0.231, 0.103],
            [0.141, 0.103],
          ],
        },
        supplierWebsite: {
          reconstructed: false,
          polygon: [],
          confidence: 0,
          boundingBox: [
            [null, null],
            [null, null],
            [null, null],
            [null, null],
          ],
        },
        taxes: [],
        totalAmount: {
          value: 16102.5,
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.853, 0.544],
            [0.969, 0.544],
            [0.969, 0.561],
            [0.853, 0.561],
          ],
          confidence: 1,
          boundingBox: [
            [0.853, 0.544],
            [0.969, 0.544],
            [0.969, 0.561],
            [0.853, 0.561],
          ],
        },
        totalNet: {
          value: 16102.5,
          reconstructed: false,
          pageId: 0,
          polygon: [
            [0.853, 0.544],
            [0.969, 0.544],
            [0.969, 0.561],
            [0.853, 0.561],
          ],
          confidence: 1,
          boundingBox: [
            [0.853, 0.544],
            [0.969, 0.544],
            [0.969, 0.561],
            [0.853, 0.561],
          ],
        },
        totalTax: {
          reconstructed: false,
          polygon: [],
          confidence: 0,
          boundingBox: [
            [null, null],
            [null, null],
            [null, null],
            [null, null],
          ],
        },
      },
    },
    nPages: 1,
  },
};

const formSchema = z.object({
  date: z.string(),
  dueDate: z.string(),
  invoiceNumber: z.string(),
  supplierName: z.string(),
  supplierAddress: z.string(),
  supplierEmail: z.string(),
  supplierPhoneNumber: z.string(),
  totalNet: z.number(),
  totalAmount: z.number(),
  totalTax: z.number(),
  lineItems: z.array(
    z.object({
      confidence: z.number(),
      description: z.string(),
      productCode: z.string(),
      quantity: z.number(),
      totalAmount: z.number(),
      unitPrice: z.number(),
      pageId: z.number(),
    }),
  ),
});

const ExtractionReview = ({ fileUrls }: { fileUrls: string[] }) => {
  const data = mindeeResponse.document.inference.prediction;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: data.date.value || "",
      dueDate: data.dueDate.value || "",
      invoiceNumber: data.invoiceNumber.value || "",
      supplierName: data.supplierName.value || "",
      supplierAddress: data.supplierAddress.value || "",
      supplierEmail: data.supplierEmail.value || "",
      supplierPhoneNumber: data.supplierPhoneNumber.value || "",
      totalNet: data.totalNet.value,
      totalAmount: data.totalNet.value,
      totalTax: 0, // Needs to read total tax from the data, but may not exist.
      lineItems: data.lineItems.map((lineItem) => ({
        confidence: lineItem.confidence,
        description: lineItem.description,
        productCode: lineItem.productCode,
        quantity: lineItem.quantity,
        totalAmount: lineItem.totalAmount,
        unitPrice: lineItem.unitPrice,
        pageId: lineItem.pageId,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const addLineItem = () => {
    append({
      confidence: 0,
      description: "",
      productCode: "",
      quantity: 0,
      totalAmount: 0,
      unitPrice: 0,
      pageId: 0,
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden pl-4 pt-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Bills</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-black">Review</BreadcrumbItem>
      </BreadcrumbList>
      <div className="flex h-full w-full rounded-tl border-l border-t">
        <div className="flex w-fit flex-col border-r">
          <div className="flex h-fit min-h-10 items-center justify-between border-b bg-wm-white-50 px-2 text-sm">
            <p className="font-medium">Current File</p>
            <p className="flex items-center gap-1">
              <CaretDownIcon />
              {mindeeResponse.document.filename}
            </p>
          </div>
          <div className="flex h-full w-fit flex-col bg-wm-white-50 p-4">
            <PDFViewer fileUrl={fileUrls[0]} />
          </div>
        </div>
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="flex h-10 min-h-10 w-full rounded-none">
            <TabsTrigger
              value="1"
              className="flex h-full w-full justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
            >
              1. Review & Edit Details
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="flex h-full w-full justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
            >
              2. Upload to Quickbooks
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="1"
            className="flex h-[calc(100%-92px)] flex-col gap-4 overflow-scroll  p-4"
          >
            <Form {...form}>
              <form className="space-y-4">
                <div className="flex w-full items-center justify-between">
                  <p className="text-2xl">
                    Total: ${form.getValues("totalAmount")?.toFixed(2) || 0}
                  </p>
                  <div className="text-xs">
                    <p>Tax: ${form.getValues("totalTax")?.toFixed(2) || 0}</p>
                    <p>
                      Tax: ${form.getValues("totalAmount")?.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 rounded-md border">
                  <div className="flex h-10 w-full items-center border-b p-2 text-sm font-medium">
                    Bill Details
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-3 pt-0">
                    <FormField
                      control={form.control}
                      name="supplierName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Workman Concrete" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice #</FormLabel>
                          <FormControl>
                            <Input placeholder="Workman Concrete" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Due</FormLabel>
                          <FormControl>
                            <Input placeholder="Workman Concrete" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Issued</FormLabel>
                          <FormControl>
                            <Input placeholder="Workman Concrete" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-3 rounded-md border last:space-y-0">
                  <div className="flex h-10 w-full items-center border-b p-2 text-sm font-medium">
                    Line Items
                  </div>
                  {form.getValues().lineItems?.map((lineItem, index) => (
                    <div className="grid grid-cols-2 gap-3 border-b p-4 pt-2 last:border-0">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Workman Concrete"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.totalAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Balance ($)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Workman Concrete"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.productCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Workman Concrete"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-end gap-4 self-end text-xs">
                        Confidence:{" "}
                        {Number(lineItem.confidence.toFixed(2)) * 100}%
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded p-2 hover:bg-wm-white-50 hover:text-red-500"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  )) || <p>No line items</p>}
                  <Button
                    variant={"ghost"}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault;
                      addLineItem();
                    }}
                  >
                    <PlusIcon />
                    Add Line Item
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="2">Step 2</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExtractionReview;
