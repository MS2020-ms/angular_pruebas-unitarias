import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CartComponent } from "./cart.component";
import { BookService } from "src/app/services/book.service";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";
import { By } from "@angular/platform-browser";

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

const listBookEmpty: Book[] = [];

describe('Cart component', () => {

    let component: CartComponent;
    //fixture: variable para extraer de nuestro component el servicio, detectar cambios...
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService;

    //CONFIGURACION del test
    beforeEach(() => {
        //TestBed: va a tener toda la configuracion del test
        TestBed.configureTestingModule({
            //Modulos
            imports: [
                //HttpClientTestingModule xa accesos API (get, post...) o probar componentes con servicios que si lo esten llamando. 
                //No hace una peticion real!. Si lo hiciera con HttpClientModule, haría peticiones reales no deseadas (put, delete...)
                //Importar todos modulos necesarios (pe. AngularMaterial, Calendario, Mapa...)
                HttpClientTestingModule
            ],
            //Componente
            declarations: [
                CartComponent
            ],
            //Servicios que inyecto en constructor de mi componente
            providers: [
                BookService,
                //Solo xa ALTERNATIVA para instanciar un componente o servicio
                CartComponent
            ],
            //xa evitar errores anadir schemas y compileComponents()
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    //INSTANCIA del test (inicializar component y fixture, resetear variables)
    //CUIDADO este metodo ngOnInit(), llama al servicio !!! Rompemos el test unitario !!! Solucion -> en beforEach crear un espia
    beforeEach(() => {
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        //el componente estara entrando por el metodo ngOnInit()
        fixture.detectChanges();

        service = fixture.debugElement.injector.get(BookService);

        //nuestro onInit() no estaría llamando al servicio
        //spyOn(service, 'getBooksFromCart').and.callFake(()=>listBook);
        spyOn(service, 'getBooksFromCart').and.callFake(() => null);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    //ALTERNATIVA para instanciar un componente o servicio. No recomendado, solo para corrección de codigo antiguo
    //En este caso poner CartComponent en los providers en lugar de en los declarations!!!
    it('should create', inject([CartComponent], (testComponent: CartComponent) => {
        expect(testComponent).toBeTruthy();
    }));

    //Test a un metodo CON return getTotalPrice()
    //Primero crear array de libros fuera del it, xa usarlo en otros test
    it('getTotalPrice() returns an amount', () => {
        const totalPrice = component.getTotalPrice(listBook);
        // expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBe(0);
        expect(totalPrice).not.toBeNull();
    });

    //Test a un metodo SIN return onInputNumberChange() -> uso del spyOn
    //Los espias estan atentos a que un metodo/s dentro del metodo han sido llamados
    //Un test unitario no debe de llamar a otro metodo o metodo en un servicio !!!
    it('onInputNumberChange() increment corretly', () => {
        const action = 'plus';
        // const book = listBook[0];
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2,
        };

        // OPCION: No correcta. Sacar el servicio -> el servicio no es public, es private!!!
        // MALA: estropeo el tipado de TS
        // const service = (component as any)._bookService;

        // MENOS MALA: respeto el tipado de TS
        // const service2 = component['_bookService'];

        // MEJOR:
        // const service = fixture.debugElement.injector.get(BookService);

        //PRIMERO espiamos el servicio, sobre el metodo updateAmountBook() y hago una llamada falsa = que NO llame al servicio. No hace una peticion real
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

        expect(book.amount).toBe(2);

        component.onInputNumberChange(action, book);

        // expect(book.amount).toBe(3);
        expect(book.amount === 3).toBeTrue();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('onInputNumberChange() decrement corretly', () => {
        const action = 'minus';
        // const book = listBook[0];
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2,
        };

        //PRIMERO espiamos el servicio, sobre el metodo updateAmountBook() y hago una llamada falsa = que NO llame al servicio. No hace una peticion real
        //metodo se epia y se va sustituir por este otro metodo .and.callFake(() => null) or .and.callFake(() => {[]}) porque no debe de llamarse (anula lo que haga el servicio).
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

        expect(book.amount).toBe(2);

        component.onInputNumberChange(action, book);

        expect(book.amount).toBe(1);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });

    //OP1: CORRECTO: Probar un metodo privado: llamado desde el metodo publico que lo contiene
    //CUIDADO este metodo publico, llama a un metodo privado que llama un servicio !!! Rompemos el test unitario !!! -> solucion: crear un spia 2 al metodo removeBooksFromCart()
    it('onClearBooks() -> _clearListCartBook() works correctly', () => {
        // MALA: Un metodo privado no debe ser probado directamente
        // component['_clearListCartBook'];

        //Crear un espia 1, para comprobar que el metodo privado ha sido llamado
        //para poder hacer un espia a un metodo privado -> (component as any)
        //sin .and.callFake() -> .and.callThrough() este metodo lo vamos a llamar y espiar
        //Crear un espia 2, para que el metodo privado no llame realmente al servicio -> .and.callFake(() => null) porque no debe de llamarse (anula lo que haga el servicio).
        const spy1 = spyOn((component as any), '_clearListCartBook').and.callThrough();
        const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);

        component.listCartBook = listBook;
        console.log('before: ' + component.listCartBook.length);

        component.onClearBooks();
        console.log('after: ' + component.listCartBook.length);

        // expect(component.listCartBook.length).toBe(0);
        expect(component.listCartBook.length === 0).toBeTrue();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('onClearBooks() with an emty list, show a console log', () => {
        const spy1 = spyOn(console, 'log');

        component.listCartBook = listBookEmpty;
        component.onClearBooks();

        expect(component.listCartBook.length === 0).toBeTrue();
        expect(spy1).toHaveBeenCalledWith('No books available');
    });

    //OP2: NO CORRECTO: Probar un metodo privado directamente:
    it('_clearListCartBook() works correctly', () => {
        const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
        component.listCartBook = listBook;
        component['_clearListCartBook']();

        expect(component.listCartBook.length).toBe(0);
        expect(spy2).toHaveBeenCalled();
    });

    it('The title "The cart is empty" is not displayed wehn there is a list', () => {
        //anado libros al listCartBook
        component.listCartBook = listBook;
        //digo a Angular: actualiza nuestra vista!
        fixture.detectChanges();
        //capturo el <h5></h5> que muestra el mensaje
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeFalsy();
    });

    it('The title "The cart is empty" is displayed correctly when the list is empty', () => {
        component.listCartBook = [];
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeTruthy();
        if (debugElement) {
            const element: HTMLElement = debugElement.nativeElement;
            expect(element.innerHTML).toContain('The cart is empty')
        }
    });
});