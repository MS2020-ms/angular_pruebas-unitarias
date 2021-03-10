import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { Book } from "../models/book.model";
import { BookService } from "./book.service";
import swal from 'sweetalert2';

const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 5,
    },
];

const book: Book = {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2,
}

describe('BookService', () => {

    let service: BookService;
    //para hacer peticiones Mock, no peticiones reales
    let httpMock: HttpTestingController;
    //para simular un localStorage vacio
    let storage = [];

    //CONFIGURACION del test
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            //no tengo declarations -> no tengo componentes
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    //INSTANCIA del test
    beforeEach(() => {
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);

        //resetear el storage antes de cada test
        storage = [];
        //creo espia 1 para simular localStorage 'getItem'
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return storage[key] ? storage[key] : null;
        });

        //creo espia 2 para simular localStorage 'setItem'
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return storage[key] = value;
        })
    });

    //Xa servicios que realizan peticiones a API
    afterEach(() => {
        //para que no haya peticiones pendientes entre cada test, y no se lance el siguiente test mientras haya una peticion pendiente
        httpMock.verify();
    });

    it('should be created correctly', () => {
        expect(service).toBeTruthy();
    });

    //Comprobar un metodo que conecta con una API
    it('getBooks() return a list of books and does a get method', () => {
        service.getBooks().subscribe((resp: Book[]) => {
            //.toEqual xa comparar Objetos o Array
            expect(resp).toEqual(listBook)
        });

        const req = httpMock.expectOne(environment.API_REST_URL + '/book');
        expect(req.request.method).toBe('GET');
        //simula la peticion se ha hecho y devuelve un Observable de listBook -> salta la subscribcion al metodo getBooks() de arriba
        req.flush(listBook);
    });

    //Comprobar un metodo que guarda en el LocalStorage
    //es un metodo con return
    //crear un espia xa similar el localStorage
    it('getBooksFromCart() return empty array wehn localStorage is empty', () => {
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

    it('addBookToCart() add a book sucessfully when the list does not exist in the localStorage', () => {
        //creo un espia para similar el metodo _toastSuccess
        //.and.callFake porque no quiero que se llame
        const toast = {
            fire: () => null
        } as any;
        const spy1 = spyOn(swal, 'mixin').and.callFake(() => {
            return toast;
        })

        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);

        //anado un libro
        service.addBookToCart(book);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);

        //anado otro libro -> objeto de otro test
        // service.addBookToCart(book);
        // listBook = service.getBooksFromCart();
        // expect(listBook.length).toBe(1);

        expect(spy1).toHaveBeenCalled();
    });

    it('removeBooksFromCart() removes the list from the localStorage', () => {
        //primero anado un libro
        service.addBookToCart(book);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);

        //segundo borro la lista de libros de cart
        service.removeBooksFromCart();
        listBook = service.getBooksFromCart()
        expect(listBook.length).toBe(0);
    })
})